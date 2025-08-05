import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const transactionId = parseInt(id);
  try {
    const supplirTransactions = await prisma.supplierTransaction.findMany({
      where: { supplierId: transactionId },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!supplirTransactions || supplirTransactions.length === 0) {
      return NextResponse.json(
        { message: `لا يوجد سجل حركات للمستخدم بالرقم ${transactionId}` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        data: supplirTransactions,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "500 Internal Server Error" },
      { status: 500 }
    );
  }
}
