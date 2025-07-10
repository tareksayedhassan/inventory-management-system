import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { CompStatus } from "@prisma/client";
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

    const photoFile = formData.get("file") as File | null;
    const photo = photoFile ? photoFile.name : "default.jpg";

    const status = formData.get("status") as CompStatus;
    const general_alert = formData.get("general_alert") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const company_code = formData.get("company_code") as string;
    const added_by_id = parseInt(formData.get("added_by_id") as string);
    const updated_by_id = parseInt(formData.get("updated_by_id") as string);

    const newCompany = await prisma.company.create({
      data: {
        photo,
        status,
        general_alert,
        address,
        phone,
        company_code,
        added_by: {
          connect: { id: added_by_id },
        },
        updated_by: {
          connect: { id: updated_by_id },
        },
      },
    });

    return NextResponse.json(
      { message: "Company added successfully", data: newCompany },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create company error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
