import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { amount, tax, supplierId, productId, treasuryId, userId } = body;

    const supplierHasEzn = await prisma.eznEdafa.findFirst({
      where: { supplierId },
    });

    const productHasEzn = await prisma.eznEdafa.findFirst({
      where: { productId },
    });

    const treasury = await prisma.treasury.findUnique({
      where: { id: treasuryId },
    });

    if (!treasury) {
      return NextResponse.json(
        { message: "الخزنه غير موجوده" },
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
    const isTaxed = newEzn.tax === 14;
    const stockTax = isTaxed ? newEzn.amount : 0;
    const stockNotTax = !isTaxed ? newEzn.amount : 0;
    const totalStock = newEzn.amount;
    const totalValue = totalStock * newEzn.product.price;

    // إنشاء سجل في جدول المخزون
    await prisma.stock.create({
      data: {
        name: productName,
        stockTax,
        stockNotTax,
        totalStock,
        totalValue,
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
