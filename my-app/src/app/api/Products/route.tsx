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

    const code = formData.get("code") as string;
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const unit = formData.get("unit") as string;
    const buyPrice = parseFloat(formData.get("buyPrice") as string);
    const sellPrice = parseFloat(formData.get("sellPrice") as string);
    const stock = parseInt(formData.get("stock") as string, 10);
    const minStock = parseInt(formData.get("minStock") as string, 10);
    const note = formData.get("note") as string;

    const treasuryId = parseInt(formData.get("treasuryId") as string, 10); // 👈 ID الخزنة
    const added_by_id = parseInt(formData.get("added_by_id") as string, 10);
    const updated_by_id = parseInt(formData.get("updated_by_id") as string, 10);

    const categoryId = parseInt(formData.get("categoryId") as string, 10);
    const newProduct = await prisma.product.create({
      data: {
        code,
        name,
        category: {
          connect: { id: categoryId },
        },
        unit,
        buyPrice,
        sellPrice,
        minStock,
        note,
        added_by: { connect: { id: added_by_id } },
        updated_by: { connect: { id: updated_by_id } },
      },
    });

    await prisma.productTreasury.create({
      data: {
        productId: newProduct.id,
        treasuryId: treasuryId,
        stock: stock,
      },
    });

    return NextResponse.json(
      { message: "تمت إضافة الصنف بنجاح" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء إضافة الصنف", error },
      { status: 500 }
    );
  }
}
