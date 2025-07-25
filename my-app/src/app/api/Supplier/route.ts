import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { CompStatus } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

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
        transactions: {
          orderBy: { createdAt: "desc" },
          include: { treasury: { select: { name: true, balance: true } } },
        },
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
    const file = formData.get("file") as File | null;

    let photoFileName = "default.jpg";
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      photoFileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(
        process.cwd(),
        "public/uploads",
        photoFileName
      );
      await fs.writeFile(filePath, buffer);
    }

    const general_alert = formData.get("general_alert") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const name = formData.get("name") as string;
    const added_by_id = parseInt(formData.get("added_by_id") as string, 10);
    const updated_by_id = parseInt(formData.get("updated_by_id") as string, 10);
    const treasuryIdFromForm = formData.get("treasuryId");

    const statusRaw = formData.get("status") as string;
    const status = Object.values(CompStatus).includes(statusRaw as CompStatus)
      ? (statusRaw as CompStatus)
      : undefined;

    if (!status) {
      return NextResponse.json({ message: "حالة غير صالحة" }, { status: 400 });
    }

    const newSupplier = await prisma.supplier.create({
      data: {
        status,
        general_alert,
        address,
        phone,
        name,
        added_by_id,
        updated_by_id,
        photo: photoFileName,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: added_by_id },
      select: { name: true },
    });

    const userName = user?.name || "مستخدم غير معروف";

    const redirectUrl = `/Supplier`;
    const now = new Date();
    const dateStr = now.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = now.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
