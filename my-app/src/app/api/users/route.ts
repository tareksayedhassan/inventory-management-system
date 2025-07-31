import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { registervalidate } from "@/utils/ValidationSchemas";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
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

    const total = await prisma.user.count({
      where: addressFilter,
    });

    const users = await prisma.user.findMany({
      where: addressFilter,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!users || users.length === 0) {
      return NextResponse.json(
        {
          message: "not found users",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: users,
        total: total,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const Validation = registervalidate.safeParse(body);
    if (!Validation.success) {
      return NextResponse.json(
        {
          message: Validation.error.issues[0].message,
        },
        { status: 400 }
      );
    }
    const data = Validation.data;
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (user) {
      return NextResponse.json(
        {
          message: "Email aleady exists",
        },
        { status: 400 }
      );
    }

    const HashedPassword = await bcrypt.hash(data.password, 10);
    const role = data.role?.toUpperCase() === "ADMIN" ? Role.ADMIN : Role.USER;
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: HashedPassword,
        role: role,
      },
    });

    return NextResponse.json(
      {
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "internal server Error",
      },
      { status: 500 }
    );
  }
}
