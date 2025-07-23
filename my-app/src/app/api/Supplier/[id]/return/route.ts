import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { TransactionType, ReturnType } from "@prisma/client";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supplierId = parseInt(id, 10);
    const { amount, description, treasuryId, returnType } = await req.json();

    // التحقق من البيانات
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
      return NextResponse.json(
        { message: "Invalid return amount" },
        { status: 400 }
      );
    }

    if (!returnType || !Object.values(ReturnType).includes(returnType)) {
      return NextResponse.json(
        { message: "Invalid return type" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // تأكد إن المورد موجود
      const supplier = await tx.supplier.findUnique({
        where: { id: supplierId },
      });
      if (!supplier) throw new Error("Supplier not found");

      // تحديث رصيد المورد
      // المرتجع (RETURN) بيقلل من الديون أو الدائن حسب نوع المرتجع
      let updatedSupplier;
      if (returnType === "PURCHASE_RETURN") {
        // إرجاع شراء => يقلل من الدائن
        updatedSupplier = await tx.supplier.update({
          where: { id: supplierId },
          data: {
            creditBalance: Math.max((supplier.creditBalance || 0) - amount, 0),
            netBalance:
              Math.max((supplier.creditBalance || 0) - amount, 0) -
              (supplier.debitBalance || 0),
          },
        });
      } else if (returnType === "SALE_RETURN") {
        // إرجاع بيع => يقلل من المدين
        updatedSupplier = await tx.supplier.update({
          where: { id: supplierId },
          data: {
            debitBalance: Math.max((supplier.debitBalance || 0) - amount, 0),
            netBalance:
              (supplier.creditBalance || 0) -
              Math.max((supplier.debitBalance || 0) - amount, 0),
          },
        });
      }

      // تحديث الخزنة (نضيف المبلغ لأنه مرتجع)
      await tx.treasury.update({
        where: { id: treasuryId },
        data: { balance: { increment: amount } },
      });

      // تسجيل المعاملة
      const transaction = await tx.transaction.create({
        data: {
          type: TransactionType.RETURN,
          returnType,
          amount,
          description,
          supplierId,
          treasuryId,
        },
      });

      return { transaction, updatedSupplier };
    });

    return NextResponse.json(
      { message: "Return processed successfully", data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Return error:", error);
    return NextResponse.json(
      { message: "Error during return", error: (error as Error).message },
      { status: 500 }
    );
  }
}
