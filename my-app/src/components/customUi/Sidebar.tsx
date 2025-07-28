"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookie from "cookie-universal";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { MdOutlineDashboard } from "react-icons/md";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaBox } from "react-icons/fa";
import { GiReturnArrow } from "react-icons/gi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { PiTreasureChestBold } from "react-icons/pi";
import { FaUserTie } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa6";
import { FaUsersGear } from "react-icons/fa6";
import { FaChartBar } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";

import { MdInventory2 } from "react-icons/md"; // لأيقونات

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

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
      className="fixed top-[70px] right-0 h-[calc(100vh-70px)] w-64 bg-white shadow-md p-3 z-50 overflow-y-auto scrollbar-none"
      dir="rtl"
    >
      {/* البروفايل */}
      <div className="flex flex-col items-center gap-3 mb-4">
        <Avatar>
          <AvatarImage src={avatar} />
          <AvatarFallback>
            {decoded?.name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <h2 className="font-bold text-base text-gray-800">
          {decoded?.name || ""}
        </h2>
        <p className="text-sm text-gray-500">{decoded?.role || ""}</p>
      </div>

      <div className="flex flex-col gap-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition duration-200"
        >
          <MdOutlineDashboard className="text-xl" />
          <span>لوحة التحكم</span>
        </Link>
        <Link
          href="/dashboard/eznEdafa"
          className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition duration-200"
        >
          <IoIosAddCircleOutline className="text-xl" />
          <span>اذن اضافة</span>
        </Link>
        <Link
          href="/dashboard/Supplier"
          className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition duration-200"
        >
          <FaUserTie className="text-xl" />
          <span>الموردين</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition duration-200"
        >
          <FaAddressCard className="text-xl" />
          <span>العملاء</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition duration-200"
        >
          <FaUsersGear className="text-xl" />
          <span>اداره المستخدمين</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition duration-200"
        >
          <FaChartBar className="text-xl" />
          <span>التقارير</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition duration-200"
        >
          <FaFileInvoiceDollar className="text-xl" />
          <span>فاتورة بيع</span>
        </Link>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition duration-200">
              <FaBoxes />
              <span className="text-sm font-medium">إدارة المخزون</span>
            </AccordionTrigger>
            <AccordionContent className="pl-8 pr-3 py-2 flex flex-col gap-1">
              <Link
                href="/dashboard/stocks"
                className="flex items-center gap-2 text-sm px-2 py-2 rounded hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition duration-200"
              >
                <MdInventory2 className="text-lg" />
                <span>مخزون بضريبة</span>
              </Link>
              <Link
                href="/dashboard/StockWithoutTax"
                className="flex items-center gap-2 text-sm px-2 py-2 rounded hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition duration-200"
              >
                <MdInventory2 className="text-lg" />
                <span>مخزون بدون ضريبة</span>
              </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Link
          href="/dashboard/Products"
          className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition duration-200"
        >
          <FaBox className="text-xl" />
          <span>اعداد الاصناف</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition duration-200"
        >
          <GiReturnArrow className="text-xl" />
          <span>مرتجع بيع وشراء</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition duration-200"
        >
          <FaArrowTrendUp className="text-xl" />
          <span>تسويه المخزون</span>
        </Link>
        <Link
          href="/dashboard/treasury"
          className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition duration-200"
        >
          <PiTreasureChestBold className="text-xl" />
          <span>الخزينه</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition duration-200"
        >
          <MdOutlineDashboard className="text-xl" />
          <span>المصروفات</span>
        </Link>
        {/* <DropsDown /> */}
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
