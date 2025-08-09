import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const productId = parseInt(id);
  const transaction = await prisma.productTransaction.findMany({
    where: {
      eznEdafaProduct: {
        is: { productId: productId },
      },
    },
    include: {
      supplier: true,
      eznEdafaProduct: {
        include: {
          product: true,
          eznEdafa: {
            select: { id: true },
          },
        },
      },
    },
  });

  if (!transaction) {
    return NextResponse.json(
      {
        message: "transaction not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      data: transaction,
    },
    { status: 200 }
  );
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transactionId = parseInt(id);

    if (isNaN(transactionId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    // نجيب الحركة
    const transaction = await prisma.productTransaction.findUnique({
      where: { id: transactionId },
      include: {
        eznEdafaProduct: {
          select: { eznEdafaId: true },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { message: "حركة المنتج غير موجودة" },
        { status: 404 }
      );
    }

    const eznEdafaId = transaction.eznEdafaProduct?.eznEdafaId;

    // نمسح الحركة
    await prisma.productTransaction.delete({
      where: { id: transactionId },
    });
    const remaining = await prisma.eznEdafaProduct.findFirst({
      where: { eznEdafaId },
    });
    if (!remaining) {
      await prisma.eznEdafa.delete({ where: { id: eznEdafaId } });
    }

    return NextResponse.json(
      { message: "تم حذف حركة المنتج بنجاح" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product transaction:", error);
    return NextResponse.json(
      { message: "500 Internal Server Error", error },
      { status: 500 }
    );
  }
}
