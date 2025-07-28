import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// سحب مبلغ من الخزنة لمورد (Supplier)
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

    await prisma.$transaction(async (tx) => {
      await tx.treasuryTransaction.create({
        data: {
          type: "WITHDRAWAL",
          amount,
          description,
          treasuryId,
        },
      });

      await tx.treasury.update({
        where: { id: treasuryId },
        data: { balance: { decrement: amount } },
      });

      const supplier = await tx.supplier.findUnique({
        where: { id: supplierId },
      });
      if (!supplier) throw new Error("Supplier not found");

      await tx.supplier.update({
        where: { id: supplierId },
        data: {
          creditBalance: (supplier.creditBalance ?? 0) + amount,
          netBalance:
            (supplier.creditBalance ?? 0) +
            amount -
            (supplier.debitBalance ?? 0),
        },
      });
    });

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
