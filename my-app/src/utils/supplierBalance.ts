import prisma from "@/utils/db";
import { SupplierStatus } from "@prisma/client";

/**
 * هذه الدالة تقوم بحساب الحالة المالية للمورد بناءً على الحركات المسجلة له.
 * - إذا كان مجموع الدائن أكبر => المورد "عليه فلوس"
 * - إذا كان مجموع المدين أكبر => المورد "ليه فلوس"
 * - إذا كانوا متساويين => "محايد"
 */
export async function updateSupplierStatus(supplierId: number) {
  const transactions = await prisma.supplierTransaction.findMany({
    where: { supplierId },
    select: {
      creditBalance: true,
      debitBalance: true,
    },
  });

  const totalCredit = transactions.reduce(
    (sum, t) => sum + (t.creditBalance ?? 0),
    0
  );

  const totalDebit = transactions.reduce(
    (sum, t) => sum + (t.debitBalance ?? 0),
    0
  );

  let newStatus: SupplierStatus = "neutral";

  if (totalDebit > totalCredit) {
    newStatus = "debitBalance";
  } else if (totalCredit > totalDebit) {
    newStatus = "creditBalance";
  }

  await prisma.supplier.update({
    where: { id: supplierId },
    data: {
      status: newStatus,
      balance: totalCredit - totalDebit,
    },
  });
}
