import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const treasuryId = parseInt(id, 10);

  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "5");
    const searchQuery = searchParams.get("search") || "";

    const filters =
      searchQuery.trim() !== ""
        ? {
            treasuryId,
            description: {
              contains: searchQuery,
            },
          }
        : { treasuryId };

    const total = await prisma.treasuryTransaction.count({ where: filters });

    const transactions = await prisma.treasuryTransaction.findMany({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: true,
        treasury: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        data: transactions,
        total,
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const transactionId = parseInt(id, 10);
  try {
    await prisma.treasuryTransaction.delete({
      where: { id: transactionId },
    });

    return NextResponse.json(
      { message: "transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting transaction", error);
    return NextResponse.json(
      { message: "500 Internal Server Error", error: error },
      { status: 500 }
    );
  }
}
