"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import DropsDown from "./DropsDown";
import { MdOutlineDashboard } from "react-icons/md";
import React, { useState } from "react";
import Link from "next/link";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { JwtPayload } from "jsonwebtoken";

const MobileSideBar = () => {
  interface MyJwtPayload extends JwtPayload {
    avatar?: string;
    name?: string;
    role?: string;
  }

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const cookie = Cookie();
  const token = cookie.get("Bearer");

  let decoded: MyJwtPayload | null = null;

  if (token) {
    try {
      decoded = jwtDecode<MyJwtPayload>(token);
    } catch (error) {
      console.error("invalid token", error);
    }
  }

  const avatar = decoded?.avatar || "/uploads/default.jpg";

  const logOut = () => {
    cookie.remove("Bearer");
    router.push("/");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        className={`xl:hidden text-gray-800 text-[20px] cursor-pointer hover:text-emerald-600 fixed top-6 left-6 z-[1001] ${
          isOpen ? "hidden" : "block"
        }`}
      >
        <FaBars />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[80vw] max-w-[240px] bg-white border-r-2 border-gray-200 shadow-none pt-[80px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-lg font-bold text-gray-800">
            <div className="flex flex-col items-center gap-2 mb-6">
              <Avatar>
                <AvatarImage src={avatar} />
                <AvatarFallback>
                  {decoded?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-bold text-lg text-gray-800">
                {decoded?.name || ""}
              </h2>
              <p className="text-sm text-gray-500">{decoded?.role || ""}</p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div dir="rtl" className="p-4">
          <span className="text-sm font-semibold text-gray-400 mb-4 block text-center">
            التنقل
          </span>

          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition duration-200"
            >
              <span>لوحة التحكم</span>
              <MdOutlineDashboard className="text-xl" />
            </Link>

            <DropsDown />

            <button
              onClick={logOut}
              className="mt-6 px-3 py-2 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 transition duration-200 text-right"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSideBar;
