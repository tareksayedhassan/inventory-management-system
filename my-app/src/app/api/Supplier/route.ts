import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
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
            name: {
              contains: searchQuery,
            },
          }
        : {};

    const total = await prisma.supplier.count({ where: filters });
    const suppliers = await prisma.supplier.findMany({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        added_by: { select: { name: true } },
        updated_by: { select: { name: true } },
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
    console.error("Error fetching suppliers:", error);
    return NextResponse.json(
      { message: "فشل في جلب الموردين" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const name = formData.get("name") as string;
    const Campname = formData.get("Campname") as string;
    const balance = parseFloat(formData.get("balance") as string) || 0;
    const note = (formData.get("note") as string) || "";
    const added_by_id = parseInt(formData.get("added_by_id") as string, 10);
    const updated_by_id = parseInt(formData.get("updated_by_id") as string, 10);
    const treasuryIdFromForm = formData.get("treasuryId");
    const tax_number = formData.get("tax_number") as string;

    const newSupplier = await prisma.supplier.create({
      data: {
        balance,
        Campname,
        status: "neutral", // دايمًا تبدأ بـ neutral
        tax_number,
        note,
        address,
        phone,
        name,
        added_by_id,
        updated_by_id,
      },
    });

    // احسب الحالة الحقيقية من المعاملات
    await updateSupplierStatus(newSupplier.id);

    const user = await prisma.user.findUnique({
      where: { id: added_by_id },
      select: { name: true },
    });

    const userName = user?.name || "مستخدم غير معروف";

    const redirectUrl = `/Supplier`;
    const now = new Date();
    const message = `تم إضافة مورد جديد "${name}" (هاتف: ${
      phone || "غير متوفر"
    }) بواسطة ${userName}`;

    await prisma.notification.create({
      data: {
        message,
        userId: added_by_id || null,
        treasuryId: treasuryIdFromForm
          ? parseInt(treasuryIdFromForm as string, 10)
          : null,
        redirectUrl,
      },
    });

    return NextResponse.json(newSupplier, { status: 201 });
  } catch (error) {
    console.error("Error creating supplier:", error);
    return NextResponse.json(
      { message: "فشل في إضافة المورد", error },
      { status: 500 }
    );
  }
}
