import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// ايداع مبلغ في الخزينه
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const treasuryId = parseInt(params.id);
    const { amount, description } = await req.json();

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.treasuryTransaction.create({
        data: {
          type: "deposit",
          amount,
          description,
          treasuryId,
        },
      }),
      prisma.treasury.update({
        where: { id: treasuryId },
        data: { balance: { increment: amount } },
      }),
    ]);

    return NextResponse.json(
      { message: "Deposit added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Deposit error:", error);
    return NextResponse.json(
      { message: "Error during deposit" },
      { status: 500 }
    );
  }
}
