import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const transactionId = parseInt(id);

  const transaction = await prisma.productTransaction.findUnique({
    where: {
      id: transactionId,
    },
    include: {
      supplier: true,
      Client: true,
      added_by: true,
      Stock: true,
      StockWithoutTax: true,
      eznEdafaProduct: {
        include: {
          product: true,
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
