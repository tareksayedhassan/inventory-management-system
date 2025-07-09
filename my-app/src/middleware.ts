import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "@/Types/CustomJWTDecoded";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("Bearer")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const decoded: CustomJwtPayload = jwtDecode(token);
      if (decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (err) {
      console.log("Invalid token for dashboard:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Authorization header
  if (pathname.startsWith("/api/users/user")) {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      const decoded: CustomJwtPayload = jwtDecode(token);
      if (decoded.role !== "ADMIN") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
