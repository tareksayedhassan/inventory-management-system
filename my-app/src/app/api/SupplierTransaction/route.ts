import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
export async function GET(req: NextRequest) {
  const Transactions = await prisma.supplierTransaction.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      supplier: true,
    },
  });

  if (!Transactions) {
    return NextResponse.json(
      {
        message: "not found Transactions",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      data: {
        Transactions,
      },
    },
    { status: 200 }
  );
}
