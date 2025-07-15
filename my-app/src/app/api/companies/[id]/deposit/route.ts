import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// إيداع مبلغ في الخزنة لشركة
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

    await prisma.$transaction([
      prisma.companyTransaction.create({
        data: {
          type: "DEPOSIT",
          amount,
          description,
          treasuryId,
          companyId,
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
