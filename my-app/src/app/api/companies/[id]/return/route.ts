import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// مرتجع مبلغ إلى الخزنة من شركة
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const companyId = parseInt(id, 10);
    const { amount, description, treasuryId } = await req.json();
    console.log({ companyId, treasuryId, amount, description });

    // التحقق من البيانات
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
      return NextResponse.json(
        { message: "Invalid return amount" },
        { status: 400 }
      );
    }

    // تأكد إن الخزنة موجودة
    const treasury = await prisma.treasury.findUnique({
      where: { id: treasuryId },
    });

    if (!treasury) {
      return NextResponse.json(
        { message: "Treasury not found" },
        { status: 404 }
      );
    }

    // المعاملة + زيادة الرصيد
    await prisma.$transaction([
      prisma.companyTransaction.create({
        data: {
          type: "RETURN",
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
