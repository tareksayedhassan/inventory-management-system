import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { TransactionType } from "@prisma/client";
import { updateSupplierStatus } from "@/utils/supplierBalance";

// GET all suppliers with pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "5");
    const searchQuery = searchParams.get("search") || "";

    const filters =
      searchQuery.trim() !== ""
        ? {
            description: {
              contains: searchQuery,
            },
          }
        : {};

    const total = await prisma.treasuryTransaction.count({ where: filters });
    const suppliers = await prisma.treasuryTransaction.findMany({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
      },
    });

    return NextResponse.json(
      {
        data: suppliers,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "فشل في جلب الحركات" },
      { status: 500 }
    );
  }
}

// POST create new treasury transaction
// routes/api/treasury/transaction.ts

// POST create new treasury transaction
export async function POST(req: NextRequest) {
  try {
    const {
      amount,
      type,
      treasuryId,
      description = "",
      reference,
      userId,
      method,
      supplierId,
      clientId,
      createdAt,
      note,
    } = await req.json();

    // 1. التحقق من وجود الخزنة
    const treasury = await prisma.treasury.findUniqueOrThrow({
      where: { id: treasuryId },
    });

    // 2. التحقق إذا كانت العملية سحب
    const isWithdraw =
      type === TransactionType.Sadad_le_moored ||
      type === TransactionType.Sa7b_mobasher;

    // 3. التحقق من الرصيد في حالة السحب
    if (isWithdraw && amount > treasury.balance) {
      return NextResponse.json(
        { message: "لا يمكن سحب مبلغ أكبر من رصيد الخزنة الحالي." },
        { status: 400 }
      );
    }

    // 4. حساب الرصيد الجديد للخزنة
    const updatedBalance = isWithdraw
      ? treasury.balance - amount
      : treasury.balance + amount;

    // 5. توليد وصف الحركة حسب النوع
    let finalDescription = description;

    if (type === TransactionType.Sadad_le_moored) {
      if (!supplierId) {
        return NextResponse.json(
          { message: "يجب اختيار المورد عند سداد دفعة لمورد." },
          { status: 400 }
        );
      }

      const supplier = await prisma.supplier.findUnique({
        where: { id: supplierId },
      });

      finalDescription = `تم سداد دفعة إلى المورد ${
        supplier?.name || "غير معروف"
      }${note ? ` (${note})` : ""}`;
    } else if (type === TransactionType.Tahseel_mn_3ameel) {
      if (!clientId) {
        return NextResponse.json(
          { message: "يجب اختيار العميل عند تحصيل دفعة من عميل." },
          { status: 400 }
        );
      }

      const client = await prisma.client.findUnique({
        where: { id: clientId },
      });

      finalDescription = `تم تحصيل دفعة من العميل ${
        client?.name || "غير معروف"
      }${note ? ` (${note})` : ""}`;
    } else if (type === TransactionType.Eda3_mobasher) {
      finalDescription = `تم إيداع مبلغ نقدي في خزنة ${treasury.name}${
        note ? ` (${note})` : ""
      }`;
    } else if (type === TransactionType.Sa7b_mobasher) {
      finalDescription = `تم سحب مبلغ نقدي من خزنة ${treasury.name}${
        note ? ` (${note})` : ""
      }`;
    }

    // 6. تنفيذ الترانزاكشن بالكامل
    await prisma.$transaction(async (tx) => {
      // حركة الخزنة
      await tx.treasuryTransaction.create({
        data: {
          method,
          type,
          amount,
          description: finalDescription,
          reference,
          treasuryId,
          userId,
          note,
          createdAt,
          supplierId: supplierId || undefined,
          clientId: clientId || undefined,
        },
      });

      // تحديث رصيد الخزنة
      await tx.treasury.update({
        where: { id: treasuryId },
        data: { balance: updatedBalance },
      });

      // تحصيل من عميل
      if (type === TransactionType.Tahseel_mn_3ameel && clientId) {
        await tx.clientTransaction.create({
          data: {
            debitBalance: amount,
            description: finalDescription,
            ClientId: clientId,
            userId,
            createdAt,
          },
        });

        await tx.client.update({
          where: { id: clientId },
          data: {
            balance: {
              decrement: amount,
            },
          },
        });
      }

      // سداد لمورد
      if (type === TransactionType.Sadad_le_moored && supplierId) {
        await tx.supplierTransaction.create({
          data: {
            debitBalance: amount,
            description: finalDescription,
            supplierId,
            treasuryId,
            userId,
            createdAt,
          },
        });

        await tx.supplier.update({
          where: { id: supplierId },
          data: {
            balance: {
              decrement: amount,
            },
          },
        });
      }
    });

    // تحديث حالة المورد بعد الترانزاكشن
    if (type === TransactionType.Sadad_le_moored && supplierId) {
      await updateSupplierStatus(supplierId, "supplier");
    }

    return NextResponse.json(
      { message: "تم تسجيل الحركة بنجاح." },
      { status: 200 }
    );
  } catch (error) {
    console.error("خطأ في تسجيل الحركة:", error);
    return NextResponse.json(
      { message: "فشل في تسجيل الحركة." },
      { status: 500 }
    );
  }
}
