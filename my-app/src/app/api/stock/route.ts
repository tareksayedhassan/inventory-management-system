import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

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

    const total = await prisma.stock.count({ where: filters });

    const totalPrice = await prisma.product.aggregate({
      where: filters,
      _sum: {
        price: true,
      },
    });
    const stocks = await prisma.stock.findMany({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        eznEdafat: {
          include: {
            product: true,
            supplier: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: stocks,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
        totalPrice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching stock:", error);
    return NextResponse.json(
      { message: "فشل في جلب بيانات الستوك" },
      { status: 500 }
    );
  }
}
