import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// سحب مبلغ من الخزنة لشركة
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const companyId = parseInt(id, 10);
    const { amount, description, treasuryId } = await req.json();
    console.log({ companyId, treasuryId, amount, description });

    if (!companyId || isNaN(companyId)) {
      return NextResponse.json(
        { message: "Invalid company ID" },
        { status: 400 }
      );
    }

    if (!treasuryId || isNaN(treasuryId)) {
      return NextResponse.json(
        { message: "Invalid treasury ID" },
        { status: 400 }
      );
    }

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    // تأكد إن الرصيد كافي
    const treasury = await prisma.treasury.findUnique({
      where: { id: treasuryId },
    });

    if (!treasury) {
      return NextResponse.json(
        { message: "Treasury not found" },
        { status: 404 }
      );
    }

    if (treasury.balance < amount) {
      return NextResponse.json(
        { message: "Insufficient balance in treasury" },
        { status: 400 }
      );
    }

    // المعاملة + تقليل الرصيد
    await prisma.$transaction([
      prisma.companyTransaction.create({
        data: {
          type: "WITHDRAWAL",
          amount,
          description,
          treasuryId,
          companyId,
        },
      }),
      prisma.treasury.update({
        where: { id: treasuryId },
        data: { balance: { decrement: amount } },
      }),
    ]);

    return NextResponse.json(
      { message: "Withdrawal successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Withdraw error:", error);
    return NextResponse.json(
      { message: "Error during withdrawal" },
      { status: 500 }
    );
  }
}
