import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import prisma from "@/utils/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const type = formData.get("type"); // "user" or "Company"

    if (type === "user") {
      const userId = parseInt(formData.get("userId") as string);
      const file = formData.get("file") as File;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      await fs.writeFile(`./public/uploads/${file.name}`, buffer);

      // إنشاء الصورة وربطها بالمستخدم (1:1)
      const image = await prisma.image.create({
        data: {
          url: file.name,
          user: {
            connect: { id: userId },
          },
        },
      });

      return NextResponse.json({ status: "user-avatar-uploaded", image });
    }

    if (type === "Company") {
      const companyId = parseInt(formData.get("companyId") as string);
      const files = formData.getAll("files") as File[];

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        await fs.writeFile(`./public/uploads/${file.name}`, buffer);

        await prisma.image.create({
          data: {
            url: file.name,
            company: {
              connect: { id: companyId },
            },
          },
        });
      }

      return NextResponse.json({ status: "company-images-uploaded" });
    }

    return NextResponse.json({ status: "unknown-type" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "fail", error }, { status: 500 });
  }
}
