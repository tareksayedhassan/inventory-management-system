"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookie from "cookie-universal";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { jwtDecode, JwtPayload } from "jwt-decode";
import DropsDown from "./DropsDown";
import { MdOutlineDashboard } from "react-icons/md";

interface MyJwtPayload extends JwtPayload {
  avatar?: string;
  name?: string;
  role?: string;
}

const SideBar = () => {
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
  };

  return (
    <div
      className="fixed top-[70px] right-0 h-[calc(100vh-70px)] w-64 bg-white shadow-md p-4 z-50 overflow-y-auto"
      dir="rtl"
    >
      {/* البروفايل */}
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
  );
};

export default SideBar;
