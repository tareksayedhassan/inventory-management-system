import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const treasuryId = parseInt(id, 10);

  try {
    const transactions = await prisma.treasuryTransaction.findMany({
      where: { treasuryId: treasuryId },
      include: {
        user: true,
        treasury: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!transactions) {
      return NextResponse.json(
        {
          message: "transactions Not Found",
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
  } catch (error) {
    return NextResponse.json(
      { message: "500 Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  const transactionId = parseInt(id, 10);
  try {
    await prisma.treasury.delete({
      where: { id: transactionId },
    });

    return NextResponse.json(
      { message: "transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting transaction", error);
    return NextResponse.json(
      { message: "500 Internal Server Error", error: error },
      { status: 500 }
    );
  }
}
