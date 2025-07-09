"use client";

import React, { useState } from "react";
import Link from "next/link";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa"; // ✅ لازم تستورد الأيقونة
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const cookie = Cookie();
  const token = cookie.get("Bearer");
  let decoded: any = null;

  if (token) {
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

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
            Hello, {decoded?.name || "Guest"}
          </SheetTitle>
        </SheetHeader>

        <div className="side-bar mobile-side-bar px-2">
          <span className="text-sm block mb-2 text-gray-600">Navigation</span>

          <Link
            href="/dashboard"
            className="block py-2 text-gray-800 hover:text-emerald-600"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/users"
            className="block py-2 text-gray-800 hover:text-emerald-600"
          >
            Users
          </Link>

          <div className="mt-4">
            <span className="text-sm block mb-2 text-gray-600">
              Authentication
            </span>
            <button
              onClick={logOut}
              className="text-left text-gray-800 hover:text-red-600 w-full"
            >
              Logout
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSideBar;
