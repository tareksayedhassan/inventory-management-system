import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

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
            name: {
              contains: searchQuery,
            },
          }
        : {};
    const total = await prisma.treasury.count({ where: addressFilter });

    const Treasury = await prisma.treasury.findMany({
      where: addressFilter,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        transactions: true,
        added_by: true,
        updated_by: true,
      },
    });

    return NextResponse.json(
      {
        data: Treasury,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Treasury:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const is_master = formData.get("is_master") === "true";
    const last_exchange_receipt_number = parseInt(
      formData.get("last_exchange_receipt_number") as string,
      10
    );
    const last_collect_receipt_number = parseInt(
      formData.get("last_collect_receipt_number") as string,
      10
    );
    const added_by_id = parseInt(formData.get("added_by_id") as string, 10);
    const updated_by_id = parseInt(formData.get("updated_by_id") as string, 10);

    const newTreasury = await prisma.treasury.create({
      data: {
        name,
        is_master,
        last_exchange_receipt_number,
        last_collect_receipt_number,
        added_by: { connect: { id: added_by_id } },
        updated_by: { connect: { id: updated_by_id } },
      },
    });

    return NextResponse.json(newTreasury, { status: 201 });
  } catch (error: any) {
    console.error("Error creating treasury:", error);
    return NextResponse.json(
      { message: "Error Added Treasury", error },
      { status: 500 }
    );
  }
}
