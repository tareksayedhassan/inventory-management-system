import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
export async function GET(req: NextRequest) {
  const transactions = await prisma.productTransaction.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      added_by: true,
      supplier: true,
    },
  });

  if (!transactions) {
    return NextResponse.json(
      {
        message: "can not found transactions",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      data: transactions,
    },
    { status: 200 }
  );
}
