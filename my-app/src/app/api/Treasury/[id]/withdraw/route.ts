import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
//  عمليات سحب الرصيد
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const treasuryId = parseInt(params.id);
    const { amount, description } = await req.json();

    const treasury = await prisma.treasury.findUnique({
      where: { id: treasuryId },
    });
    if (!treasury || treasury.balance < amount) {
      return NextResponse.json(
        { message: "Insufficient balance" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.treasuryTransaction.create({
        data: {
          type: "withdraw",
          amount,
          description,
          treasuryId,
        },
      }),
      prisma.treasury.update({
        where: { id: treasuryId },
        data: { balance: { decrement: amount } },
      }),
    ]);

    return NextResponse.json(
      { message: "Withdraw successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Withdraw error:", error);
    return NextResponse.json(
      { message: "Error during withdraw" },
      { status: 500 }
    );
  }
}
