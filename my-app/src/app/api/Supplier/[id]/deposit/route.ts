import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { TransactionType } from "@prisma/client";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supplierId = parseInt(id, 10);
    const { amount, description, treasuryId } = await req.json();

    if (!supplierId || isNaN(supplierId)) {
      return NextResponse.json(
        { message: "Invalid supplier ID" },
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

    const result = await prisma.$transaction(async (tx) => {
      // تأكيد أن المورد موجود
      const supplier = await tx.supplier.findUnique({
        where: { id: supplierId },
      });
      if (!supplier) throw new Error("Supplier not found");

      // تحديث الرصيد (الإيداع => المورد ليه فلوس عندك)
      const updatedSupplier = await tx.supplier.update({
        where: { id: supplierId },
        data: {
          debitBalance: (supplier.debitBalance || 0) + amount,
          netBalance:
            (supplier.creditBalance || 0) -
            ((supplier.debitBalance || 0) + amount),
        },
      });

      // تحديث الخزنة
      await tx.treasury.update({
        where: { id: treasuryId },
        data: { balance: { increment: amount } },
      });

      // تسجيل المعاملة
      const transaction = await tx.treasuryTransaction.create({
        data: {
          type: TransactionType.DEPOSIT,
          amount,
          description,
          treasuryId,
        },
      });

      return { transaction, updatedSupplier };
    });

    return NextResponse.json(
      { message: "Deposit added successfully", data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Deposit error:", error);
    return NextResponse.json(
      { message: "Error during deposit", error: (error as Error).message },
      { status: 500 }
    );
  }
}
