import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

import * as XLSX from "xlsx";
import { Buffer } from "buffer";
interface ProductRow {
  name: string;
  productCode?: string;
  price: string | number;
  stock: string | number;
  note: string;
  added_by_id: string | number;
  updated_by_id: string | number;
}

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
    const total = await prisma.product.count({ where: addressFilter });

    const Product = await prisma.product.findMany({
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
        data: Product,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Product:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (file && file.name.endsWith(".xlsx")) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<ProductRow>(sheet);

      const validProducts = [];

      for (const row of data) {
        const price = parseFloat(String(row.price));
        const stock = parseInt(String(row.stock));
        const added_by_id = parseInt(String(row.added_by_id));
        const updated_by_id = parseInt(String(row.updated_by_id));

        if (
          row.name &&
          !isNaN(price) &&
          !isNaN(stock) &&
          row.note &&
          !isNaN(added_by_id) &&
          !isNaN(updated_by_id)
        ) {
          validProducts.push({
            name: String(row.name),
            productCode: String(row.productCode ?? ""),
            price,
            stock,
            note: String(row.note),
            added_by: { connect: { id: added_by_id } },
            updated_by: { connect: { id: updated_by_id } },
          });
        }
      }

      for (const p of validProducts) {
        await prisma.product.create({ data: p });
      }

      return NextResponse.json(
        { message: "Products imported from Excel successfully." },
        { status: 201 }
      );
    }

    const name = formData.get("name") as string;
    const productCode = formData.get("productCode") as string;
    const price = parseFloat(String(formData.get("price")));
    const stock = parseInt(String(formData.get("stock")), 10);
    const note = formData.get("note") as string;
    const added_by_id = parseInt(String(formData.get("added_by_id")), 10);
    const updated_by_id = parseInt(String(formData.get("updated_by_id")), 10);

    if (
      !name ||
      isNaN(price) ||
      isNaN(stock) ||
      !note ||
      isNaN(added_by_id) ||
      isNaN(updated_by_id)
    ) {
      return NextResponse.json(
        { message: "Some fields are missing or invalid." },
        { status: 400 }
      );
    }

    await prisma.product.create({
      data: {
        name,
        productCode,
        price,
        stock,
        note,
        added_by: { connect: { id: added_by_id } },
        updated_by: { connect: { id: updated_by_id } },
      },
    });

    return NextResponse.json(
      { message: "Product created successfully." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        message: "An error occurred while creating the product.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
