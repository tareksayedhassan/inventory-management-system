import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { amount, tax, supplierId, productId, treasuryId, userId, isTaxed } =
      body;

    const treasury = await prisma.treasury.findUnique({
      where: { id: treasuryId },
    });

    if (!treasury) {
      return NextResponse.json(
        { message: "الخزنة غير موجودة" },
        { status: 404 }
      );
    }

    const newEzn = await prisma.eznEdafa.create({
      data: {
        amount,
        tax,
        supplier: { connect: { id: supplierId } },
        product: { connect: { id: productId } },
        treasury: { connect: { id: treasuryId } },
        user: userId ? { connect: { id: userId } } : undefined,
      },
      include: {
        supplier: true,
        product: true,
        treasury: true,
        user: true,
      },
    });

    const productName = newEzn.product.name;
    const productCode = newEzn.product.productCode;
    const totalValue = newEzn.amount * newEzn.product.price;

    let stockId: number | null = null;
    let stockWithoutTaxId: number | null = null;

    if (isTaxed) {
      const stock = await prisma.stock.create({
        data: {
          name: productName,
          productCode,
          stockTax: newEzn.amount,
          totalStock: newEzn.amount,
          totalValue,
        },
      });
      stockId = stock.id;
    } else {
      const stockWithoutTax = await prisma.stockWithoutTax.create({
        data: {
          name: productName,
          productCode,
          totalStock: newEzn.amount,
          totalValue,
        },
      });
      stockWithoutTaxId = stockWithoutTax.id;
    }

    await prisma.eznEdafa.update({
      where: { id: newEzn.id },
      data: {
        stockId,
        StockWithoutTaxID: stockWithoutTaxId,
      },
    });
    await prisma.product.update({
      where: { id: productId },
      data: {
        lastBuyPrice: amount,
      },
    });
    const totalTransactionAmount = newEzn.amount * newEzn.product.price;
    const transactionType = "WITHDRAWAL";
    const transactionDescription = `إذن إضافة رقم ${newEzn.id}`;

    await prisma.treasuryTransaction.create({
      data: {
        type: transactionType,
        amount: totalTransactionAmount,
        description: transactionDescription,
        treasuryId: treasuryId,
        userId: userId || null,
        createdAt: new Date(),
      },
    });

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

    const eznId = newEzn.id;
    const supplierName = newEzn.supplier?.name || "مورد غير معروف";
    const userName = newEzn.user?.name || "مستخدم غير معروف";

    const message = `تم إضافة إذن إضافة رقم ${eznId} للمورد "${supplierName}" بواسطة ${userName} في الساعة ${timeStr} بتاريخ ${dateStr}`;

    await prisma.notification.create({
      data: {
        message,
        userId: userId || null,
        treasuryId: treasuryId || null,
        redirectUrl: `/Supplier`,
      },
    });

    return NextResponse.json(
      { message: "تم إضافة الإذن بنجاح", data: newEzn },
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
