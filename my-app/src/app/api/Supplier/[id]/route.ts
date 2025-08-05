import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";

// get single setting
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supplierId = parseInt(id, 10);

  try {
    const setting = await prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!setting) {
      return NextResponse.json(
        {
          message: "setting Not Found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        data: setting,
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supplierId = parseInt(id, 10);

  try {
    await prisma.supplier.delete({
      where: { id: supplierId },
    });

    return NextResponse.json(
      { message: "Setting deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting setting:", error);
    return NextResponse.json(
      { message: "500 Internal Server Error", error: error },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supplierId = parseInt(id);
  const formData = await req.formData();

  try {
    const updateData: any = {};

    const name = formData.get("Name") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const status = formData.get("status") as string;
    const general_alert = formData.get("general_alert") as string;
    const file = formData.get("file") as File;

    if (name) updateData.Name = name;
    if (address) updateData.address = address;
    if (phone) updateData.phone = phone;
    if (status) updateData.status = status;
    if (general_alert) updateData.general_alert = general_alert;

    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${randomUUID()}-${file.name}`;
      const filepath = path.join(process.cwd(), "public/uploads", filename);

      await writeFile(filepath, buffer);
      updateData.photo = filename;
    }

    const updatedCompany = await prisma.supplier.update({
      where: { id: supplierId },
      data: updateData,
    });

    return NextResponse.json({ data: updatedCompany }, { status: 200 });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
