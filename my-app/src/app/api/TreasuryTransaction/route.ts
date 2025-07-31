import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
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

export async function POST(req: NextRequest) {
  const body = req.json();
}
