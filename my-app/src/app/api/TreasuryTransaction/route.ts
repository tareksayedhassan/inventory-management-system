import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { TransactionType } from "@prisma/client";

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
export async function POST(req: NextRequest) {
  try {
    let {
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

    // التحقق من وجود الخزنة
    const treasury = await prisma.treasury.findUniqueOrThrow({
      where: { id: treasuryId },
    });

    // التحقق إذا كانت العملية سحب (سداد لمورد أو سحب مباشر)
    const isWithdraw =
      type === TransactionType.Sadad_le_moored ||
      type === TransactionType.Sa7b_mobasher;

    // التحقق من الرصيد في حالة السحب
    if (isWithdraw && amount > treasury.balance) {
      return NextResponse.json(
        { message: "لا يمكن سحب مبلغ أكبر من رصيد الخزنة الحالي." },
        { status: 400 }
      );
    }

    // حساب الرصيد الجديد
    const updatedBalance = isWithdraw
      ? treasury.balance - amount
      : treasury.balance + amount;

    // إعداد الوصف بناءً على نوع الحركة
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

      const supplierName = supplier?.name || "غير معروف";
      description = `تم سداد دفعة إلى المورد ${supplierName} ${
        note ? `(${note})` : ""
      }`;
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

      description = `تم تحصيل دفعة من العميل ${client?.name || "غير معروف"} ${
        note ? `(${note})` : ""
      }`;
    } else if (type === TransactionType.Eda3_mobasher) {
      description = `تم إيداع مبلغ نقدي في خزنة ${
        treasury?.name || "غير معروفة"
      } ${note ? `(${note})` : ""}`;
    } else if (type === TransactionType.Sa7b_mobasher) {
      description = `تم سحب مبلغ نقدي من خزنة ${
        treasury?.name || "غير معروفة"
      } ${note ? `(${note})` : ""}`;
    }

    // تنفيذ معاملة الخزنة (TreasuryTransaction و Treasury)
    await prisma.$transaction([
      prisma.treasuryTransaction.create({
        data: {
          method,
          type,
          amount,
          description,
          reference,
          treasuryId,
          userId,
          note,
          createdAt,
          supplierId: supplierId || undefined,
          clientId: clientId || undefined,
        },
      }),
      prisma.treasury.update({
        where: { id: treasuryId },
        data: { balance: updatedBalance },
      }),
    ]);

    // تسجيل حركة المورد (SupplierTransaction) بشكل مستقل إذا كان نوع العملية سداد لمورد
    if (type === TransactionType.Sadad_le_moored && supplierId) {
      await prisma.supplierTransaction.create({
        data: {
          debitBalance: amount,
          description,
          supplierId,
          treasuryId,
          userId,
          createdAt,
        },
      });
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
