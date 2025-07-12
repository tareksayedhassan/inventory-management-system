import { CompStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// get single setting
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  try {
    const Category = await prisma.category.findUnique({
      where: { id },
    });

    if (!Category) {
      return NextResponse.json(
        {
          message: "Category Not Found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        data: Category,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "500 Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  try {
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { message: "500 Internal Server Error", error: error },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id, 10);

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;

    const updatedcategory = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json({ data: updatedcategory }, { status: 200 });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
