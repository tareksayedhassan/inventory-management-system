import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { CompStatus } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

// get all company with pagention
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "5");
    const searchQuery = searchParams.get("search") || "";

    const addressFilter =
      searchQuery.trim() !== ""
        ? {
            address: {
              contains: searchQuery,
              mode: "insensitive",
            },
          }
        : {};
    const total = await prisma.company.count({ where: addressFilter });

    const company = await prisma.company.findMany({
      where: addressFilter,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        added_by: true,
        updated_by: true,
      },
    });

    return NextResponse.json(
      {
        data: company,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
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
    const company_code = formData.get("company_code") as string;
    const added_by_id = parseInt(formData.get("added_by_id") as string, 10);
    const updated_by_id = parseInt(formData.get("updated_by_id") as string, 10);
    const statusRaw = formData.get("status") as string;
    const status = Object.values(CompStatus).includes(statusRaw as CompStatus)
      ? (statusRaw as CompStatus)
      : undefined;

    if (!status) {
      return NextResponse.json({ message: "حالة غير صالحة" }, { status: 400 });
    }
    const newCompany = await prisma.company.create({
      data: {
        status,
        general_alert,
        address,
        phone,
        company_code,
        added_by_id,
        updated_by_id,
        photo: photoFileName,
      },
    });

    return NextResponse.json(newCompany, { status: 201 });
  } catch (error: any) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { message: "فشل في إضافة الشركة", error },
      { status: 500 }
    );
  }
}
