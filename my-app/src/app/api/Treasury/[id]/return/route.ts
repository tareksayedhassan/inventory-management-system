import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const treasuryId = parseInt(params.id);
    const { amount, description } = await req.json();

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { message: "Invalid return amount" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.treasuryTransaction.create({
        data: {
          type: "return",
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
      { message: "Return processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Return error:", error);
    return NextResponse.json(
      { message: "Error during return" },
      { status: 500 }
    );
  }
}
