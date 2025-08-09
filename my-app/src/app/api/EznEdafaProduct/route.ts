import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
export async function GET(req: NextRequest) {
  try {
    const products = await prisma.eznEdafaProduct.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        ProductTransaction: true,
      },
    });

    if (!products) {
      return NextResponse.json(
        { message: "Products not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server Error" },
      { status: 500 }
    );
  }
}
