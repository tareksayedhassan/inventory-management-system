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

// add new company

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      photo,
      status,
      general_alert,
      address,
      phone,
      company_code,
      added_by_id,
      updaeted_by_id,
    } = body;
    const addSetting = await prisma.company.create({
      data: {
        photo,
        status,
        general_alert,
        address,
        phone,
        company_code,
        added_by: {
          connect: {
            id: added_by_id,
          },
        },
        updated_by: {
          connect: {
            id: updaeted_by_id,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "company added successfully",
        data: addSetting,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
