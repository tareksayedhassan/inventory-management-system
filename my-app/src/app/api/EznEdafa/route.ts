import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { z } from "zod";
import { updateSupplierStatus } from "@/utils/supplierBalance";

const productSchema = z.array(
  z.object({
    productId: z.number().int().positive(),
    amount: z.number().positive(),
  })
);

export async function GET(req: NextRequest) {
  // date filter
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "5");
  const searchQuery = searchParams.get("search") || "";
  let filters = {};

  if (searchQuery.trim() !== "") {
    const date = new Date(searchQuery);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    filters = {
      createdAt: {
        gte: date,
        lt: nextDay,
      },
    };
  }

  const total = await prisma.eznEdafa.count({ where: filters });

  const eznEdafa = await prisma.eznEdafa.findMany({
    where: filters,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      supplier: true,
      user: true,
      products: true,
    },
  });
  return NextResponse.json(
    {
      data: eznEdafa,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { supplierId, userId, isTaxed, tax, products } = body;

    // Validate products array
    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "لم يتم إدخال أي منتجات" },
        { status: 400 }
      );
    }

    // Validate products schema
    const validation = productSchema.safeParse(products);
    if (!validation.success) {
      return NextResponse.json(
        { message: "بيانات المنتجات غير صالحة", errors: validation.error },
        { status: 400 }
      );
    }

    // Check if supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
    });
    if (!supplier) {
      return NextResponse.json(
        { message: "المورد غير موجود" },
        { status: 404 }
      );
    }

    // Verify products existence
    const productIds = products.map((p: { productId: number }) => p.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, productCode: true, price: true },
    });

    const missingProducts = productIds.filter(
      (id: number) => !dbProducts.some((p) => p.id === id)
    );
    if (missingProducts.length > 0) {
      return NextResponse.json(
        { message: `المنتجات غير موجودة: ${missingProducts.join(", ")}` },
        { status: 404 }
      );
    }

    // Calculate totals and prepare product details
    let totalAmount = 0;
    let totalQuantity = 0;
    const productsDetails = products.map((item: any) => {
      const product = dbProducts.find((p) => p.id === item.productId)!;
      const itemTotal = item.amount * product.price;
      totalAmount += itemTotal;
      totalQuantity += item.amount;

      return {
        productId: item.productId,
        amount: item.amount,
        itemTotal,
        productName: product.name,
        productCode: product.productCode,
      };
    });

    // Create new Ezn Edafa
    const newEzn = await prisma.eznEdafa.create({
      data: {
        totalAmount: totalAmount,
        tax: tax || 0,
        supplier: { connect: { id: supplierId } },
        user: userId ? { connect: { id: userId } } : undefined,
        products: {
          create: productsDetails.map((item: any) => ({
            product: { connect: { id: item.productId } },
            amount: item.amount,
            itemTotal: item.itemTotal,
          })),
        },
      },
      include: {
        supplier: true,
        user: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    // Create stock entry based on tax status
    let stockId: number | null = null;
    let stockWithoutTaxId: number | null = null;

    if (isTaxed) {
      const stock = await prisma.stock.create({
        data: {
          name: `إذن إضافة رقم ${newEzn.id}`,
          productCode: `EZ${newEzn.id}`,
          stockTax: Math.round(totalQuantity),
          totalStock: Math.round(totalQuantity),
          totalValue: Math.round(totalAmount),
        },
      });
      stockId = stock.id;
    } else {
      const stockWithoutTax = await prisma.stockWithoutTax.create({
        data: {
          name: `إذن إضافة رقم ${newEzn.id}`,
          productCode: `EZ${newEzn.id}`,
          totalStock: Math.round(totalQuantity),
          totalValue: Math.round(totalAmount),
        },
      });
      stockWithoutTaxId = stockWithoutTax.id;
    }

    // Update Ezn Edafa with stock IDs
    await prisma.eznEdafa.update({
      where: { id: newEzn.id },
      data: {
        stockId,
        StockWithoutTaxID: stockWithoutTaxId,
      },
    });

    // Update last buy price for each product
    for (const item of products) {
      const product = dbProducts.find((p) => p.id === item.productId)!;
      await prisma.product.update({
        where: { id: item.productId },
        data: { lastBuyPrice: item.amount * product.price },
      });
    }

    // Create supplier transaction
    const createdAt = new Date();
    await prisma.supplierTransaction.create({
      data: {
        creditBalance: totalAmount,
        description: `إذن إضافة رقم ${newEzn.id}`,
        supplierId,
        userId,
        createdAt,
      },
    });

    // Update supplier status
    await updateSupplierStatus(supplierId, "supplier");

    // Create notification
    const now = new Date();
    const dateStr = now.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = now.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const supplierName = newEzn.supplier?.name || "مورد غير معروف";
    const userName = newEzn.user?.name || "مستخدم غير معروف";
    const message = `تم إضافة إذن إضافة رقم ${newEzn.id} للمورد "${supplierName}" بواسطة ${userName} في الساعة ${timeStr} بتاريخ ${dateStr}`;

    await prisma.notification.create({
      data: {
        message,
        userId: userId || null,
        redirectUrl: `/Supplier`,
      },
    });
    // بعد إنشاء newEzn
    for (const eznProduct of newEzn.products) {
      const productDetail = productsDetails.find(
        (p: any) => p.productId === eznProduct.productId
      );
      if (!productDetail) continue;

      await prisma.productTransaction.create({
        data: {
          productCode: productDetail.productCode,
          eznEdafaProductId: eznProduct.id, // ✅ هنا ID السطر من جدول EznEdafaProduct مش جدول EznEdafa
          name: productDetail.productName,
          price: productDetail.itemTotal / productDetail.amount,
          lastBuyPrice: productDetail.itemTotal / productDetail.amount,
          quantity: productDetail.amount,
          total: productDetail.itemTotal,
          type: `إذن إضافة رقم ${newEzn.id}`,
          redirctURL: `/dashboard/eznEdafa/${newEzn.id}`,
          added_by_id: userId || null,
          supplierId: supplierId || null,
          StockId: stockId || null,
          StockWithoutTaxId: stockWithoutTaxId || null,
        },
        include: {
          Stock: true,
          StockWithoutTax: true,
        },
      });
    }

    return NextResponse.json(
      {
        message: "تم إضافة الإذن بنجاح",
        data: { ...newEzn, products: productsDetails },
        totalAmount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("خطأ:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء إنشاء إذن الإضافة." },
      { status: 500 }
    );
  }
}
