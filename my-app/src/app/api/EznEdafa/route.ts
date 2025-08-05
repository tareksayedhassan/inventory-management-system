import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { z } from "zod";
import { updateSupplierStatus } from "@/utils/supplierBalance";
import { ProductMovementType } from "@prisma/client";

const productSchema = z.array(
  z.object({
    productId: z.number().int().positive(),
    amount: z.number().positive(),
  })
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { supplierId, userId, isTaxed, tax, products } = body;

    // ✅ تحقق من وجود منتجات وصحة البيانات
    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "لم يتم إدخال أي منتجات" },
        { status: 400 }
      );
    }

    const validation = productSchema.safeParse(products);
    if (!validation.success) {
      return NextResponse.json(
        { message: "بيانات المنتجات غير صالحة", errors: validation.error },
        { status: 400 }
      );
    }

    // ✅ تحقق من وجود المورد
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
    });
    if (!supplier) {
      return NextResponse.json(
        { message: "المورد غير موجود" },
        { status: 404 }
      );
    }

    // ✅ تحقق من وجود المنتجات
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

    // ✅ حساب الإجمالي وتفاصيل المنتجات
    let totalAmount = 0;
    let totalQuantity = 0;
    const productsDetails = products.map(
      (item: { productId: number; amount: number }) => {
        const product = dbProducts.find((p) => p.id === item.productId)!;
        const itemTotal = item.amount * product.price;
        totalAmount += itemTotal;
        totalQuantity += item.amount;
        return {
          productId: item.productId,
          amount: item.amount,
          productName: product.name,
          productCode: product.productCode,
          itemTotal,
        };
      }
    );

    const deductionRate = 0.01;
    const finalAmount = totalAmount - totalAmount * deductionRate;
    const newEzn = await prisma.eznEdafa.create({
      data: {
        totalAmount: finalAmount,
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
        products: true,
      },
    });

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

    // ✅ تحديث الإذن بعد إنشاء المخازن
    await prisma.eznEdafa.update({
      where: { id: newEzn.id },
      data: {
        stockId,
        StockWithoutTaxID: stockWithoutTaxId,
      },
    });

    // ✅ تحديث السعر الأخير للشراء لكل منتج
    for (const item of products) {
      const product = dbProducts.find((p) => p.id === item.productId)!;
      await prisma.product.update({
        where: { id: item.productId },
        data: { lastBuyPrice: item.amount * product.price },
      });
    }
    const createdAt = new Date();
    const finalDescription = `إذن إضافة رقم ${newEzn.id}`;

    await prisma.supplierTransaction.create({
      data: {
        creditBalance: finalAmount,
        description: finalDescription,
        supplierId,
        userId,
        createdAt,
      },
    });
    await updateSupplierStatus(supplierId, "supplier");

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
    for (const item of productsDetails) {
      await prisma.productTransaction.create({
        data: {
          productCode: item.productCode,
          name: item.productName,
          price: item.itemTotal / item.amount,
          lastBuyPrice: item.itemTotal / item.amount,
          quantity: item.amount,
          total: item.itemTotal,
          type: ProductMovementType.EznEdafa,
          note: `إذن إضافة رقم ${newEzn.id}`,
          added_by_id: userId,
          supplier: supplierId,
        },
        include: {
          supplier: true,
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
