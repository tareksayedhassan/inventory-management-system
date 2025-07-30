import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
//  عمليات سحب الرصيد
export async function POST(
  req: NextRequest,

  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const treasuryId = parseInt(id);
    const { amount, description = "", userId } = await req.json();
    console.log("Withdraw Request:", { amount, description });

    const treasury = await prisma.treasury.findUnique({
      where: { id: treasuryId },
    });
    if (!treasury || treasury.balance < amount) {
      return NextResponse.json(
        { message: "الرصيد غير كافٍ في الخزينة لإتمام العملية" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.treasuryTransaction.create({
        data: {
          type: "WITHDRAWAL",
          description,
          amount,
          treasuryId,
          userId,
        },
        include: {
          user: true,
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
  } catch (error: any) {
    console.error("Withdraw API Error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
