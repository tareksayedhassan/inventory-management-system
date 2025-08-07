// المسار: /api/eznEdafaProduct/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const Eid = parseInt(id);

    if (isNaN(Eid)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const deletedItem = await prisma.eznEdafaProduct.delete({
      where: { id: Eid },
    });

    return NextResponse.json({ data: deletedItem }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product from Ezn Edafa:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const EznEdafaProductId = parseInt(id);

  if (isNaN(EznEdafaProductId)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const body = await req.json();
  const { amount, product } = body;

  if (!product || !product.id) {
    return NextResponse.json(
      { message: "Product data is missing" },
      { status: 400 }
    );
  }

  try {
    // ✅ جيب بيانات eznEdafaProduct علشان نعرف الـ eznEdafaId (اللي فيه الضريبة)
    const eznEdafaProduct = await prisma.eznEdafaProduct.findUnique({
      where: { id: EznEdafaProductId },
      include: { eznEdafa: true }, // علشان نجيب الضريبة
    });

    if (!eznEdafaProduct) {
      return NextResponse.json(
        { message: "EznEdafaProduct not found" },
        { status: 404 }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "المنتج غير موجود" },
        { status: 404 }
      );
    }

    const quantity = amount ?? eznEdafaProduct.amount;
    const unitPrice = product.price ?? existingProduct.price;

    // ✅ الضرائب وخصم المنبع
    const taxPercentage = eznEdafaProduct.eznEdafa?.tax ?? 0;
    const withholdingPercentage = 1;

    const gross = unitPrice * quantity;
    const taxAmount = (gross * taxPercentage) / 100;
    const withholding = (gross * withholdingPercentage) / 100;

    const calculatedItemTotal = gross + taxAmount - withholding;

    // ✅ تحديث العلاقة eznEdafaProduct
    const updatedRelation = await prisma.eznEdafaProduct.update({
      where: { id: EznEdafaProductId },
      data: {
        amount: quantity,
        itemTotal: calculatedItemTotal,
      },
    });

    // ✅ تحديث المنتج نفسه
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        ...(product.name && { name: product.name }),
        ...(product.productCode && { productCode: product.productCode }),
        ...(product.price && { price: product.price }),
        ...(product.lastBuyPrice && { lastBuyPrice: product.lastBuyPrice }),
      },
    });

    return NextResponse.json({
      message: "تم التحديث بنجاح",
      relation: updatedRelation,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ message: "خطأ في التحديث" }, { status: 500 });
  }
}
