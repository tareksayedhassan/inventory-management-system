"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useSWR from "swr";
import { BASE_URL, Supplier } from "@/apiCaild/API";
import { fetcher } from "@/apiCaild/fetcher";
import { Compny } from "@/Types/company";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Cookie from "cookie-universal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Pagention from "@/components/customUi/pagention";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loading from "@/components/customUi/loading";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const cookie = Cookie();
  const router = useRouter();
  const token = cookie.get("Bearer");

  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/${Supplier}?page=${currentPage}&pageSize=${rowsPerPage}&search=${search}`,
    fetcher
  );

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  const company: Compny[] = data?.data || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const DeleteRecord = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/${Supplier}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      mutate();
      toast.info("Supplier deleted successfully");
    } catch (error) {
      toast.error("Failed to delete Supplier");
    }
  };

  const editCompany = (id: number) => {
    router.push(`/dashboard/Supplier/${id}`);
  };

  const monyOpertions = (id: number) => {
    router.push(`/dashboard/Supplier/${id}/addOpertion`);
  };

  // const calcCompanyBalance = (transactions: any[]) => {
  //   let balance = 0;
  //   for (const t of transactions) {
  //     if (t.type === "DEPOSIT") balance += t.amount;
  //     else if (t.type === "WITHDRAWAL") balance -= t.amount;
  //     else if (t.type === "RETURN") balance += t.amount;
  //   }
  //   return balance;
  // };

  return (
    <div dir="rtl" className="p-4">
      <div className="flex flex-col xl:flex-row justify-between items-center gap-4 mb-4">
        <Link href="/dashboard/Supplier/addSupplier">
          <Button
            variant="secondary"
            className="hover:bg-amber-100 w-full xl:w-auto"
          >
            إضافة مورد
          </Button>
        </Link>
        <div className="w-full max-w-sm">
          <Input
            type="search"
            placeholder="ابحث باسم المورد..."
            className="rounded-lg border border-gray-300 px-4 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden xl:block overflow-x-auto">
        <Table className="w-full border rounded-lg">
          <TableCaption className="mb-4 font-semibold text-lg text-gray-500">
            قائمة الموردين
          </TableCaption>
          <TableHeader className="sticky top-0 bg-gray-100 z-10">
            <TableRow>
              <TableHead className="w-[100px] text-right font-bold text-gray-800 text-sm px-2 py-3">
                اسم المورد
              </TableHead>
              <TableHead className="w-[80px] text-right font-bold text-gray-800 text-sm px-2 py-3">
                الصورة
              </TableHead>
              <TableHead className="w-[80px] text-right font-bold text-gray-800 text-sm px-2 py-3">
                الحالة
              </TableHead>
              <TableHead className="w-[100px] text-right font-bold text-gray-800 text-sm px-2 py-3">
                رقم المورد
              </TableHead>
              <TableHead className="w-[120px] text-right font-bold text-gray-800 text-sm px-2 py-3">
                عنوان المورد
              </TableHead>
              <TableHead className="w-[120px] text-right font-bold text-gray-800 text-sm px-2 py-3">
                مستحقات مالية
              </TableHead>
              <TableHead className="w-[120px] text-right font-bold text-gray-800 text-sm px-2 py-3">
                الإشعارات
              </TableHead>
              <TableHead className="w-[100px] text-right font-bold text-gray-800 text-sm px-2 py-3">
                تاريخ الإنشاء
              </TableHead>
              <TableHead className="w-[100px] text-right font-bold text-gray-800 text-sm px-2 py-3">
                تاريخ التحديث
              </TableHead>
              <TableHead className="w-[100px] text-right font-bold text-gray-800 text-sm px-2 py-3">
                أضيف بواسطة
              </TableHead>

              <TableHead className="w-[160px] text-right font-bold text-gray-800 text-sm px-2 py-3">
                إجراءات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {company.map((item, key) => (
              <TableRow
                key={key}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell
                  className="px-2 py-3 text-sm text-right truncate max-w-[100px]"
                  title={item.name}
                >
                  {item.name}
                </TableCell>
                <TableCell className="px-2 py-3 text-sm text-right">
                  <div className="w-10 h-10 rounded-full overflow-hidden border">
                    <Image
                      src={`/uploads/${item.photo || "default.jpg"}`}
                      alt={item.general_alert || "company avatar"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      quality={100}
                      priority
                      unoptimized
                    />
                  </div>
                </TableCell>
                <TableCell className="px-2 py-3 text-sm text-right">
                  {item.status}
                </TableCell>
                <TableCell className="px-2 py-3 text-sm text-right">
                  {item.phone}
                </TableCell>
                <TableCell
                  className="px-2 py-3 text-sm text-right truncate max-w-[120px]"
                  title={item.address}
                >
                  {item.address}
                </TableCell>
                <TableCell className="px-2 py-3 text-sm text-right">
                  {/* {item.transactions && (
                    <Badge
                      variant="outline"
                      className={`text-white font-medium rounded-full px-3 py-1 ${
                        calcCompanyBalance(item.transactions) > 0
                          ? "bg-green-600"
                          : calcCompanyBalance(item.transactions) < 0
                          ? "bg-red-600"
                          : "bg-gray-500"
                      }`}
                    >
                      {calcCompanyBalance(item.transactions) > 0
                        ? `دائن: ${calcCompanyBalance(item.transactions)}`
                        : calcCompanyBalance(item.transactions) < 0
                        ? `مدين: ${Math.abs(
                            calcCompanyBalance(item.transactions)
                          )}`
                        : "لا يوجد عمليات"}
                    </Badge>
                  )} */}
                </TableCell>
                <TableCell
                  className="px-2 py-3 text-sm text-right truncate max-w-[120px]"
                  title={item.general_alert}
                >
                  {item.general_alert}
                </TableCell>
                <TableCell className="px-2 py-3 text-sm text-right">
                  {new Date(item.createdAt.toString()).toLocaleDateString()}
                </TableCell>
                <TableCell className="px-2 py-3 text-sm text-right">
                  {new Date(item.updatedAt.toString()).toLocaleDateString()}
                </TableCell>
                <TableCell
                  className="px-2 py-3 text-sm text-right truncate max-w-[100px]"
                  title={item.added_by?.name}
                >
                  <p>{item.added_by?.name || "غير معروف"}</p>
                  <p className="text-gray-500 text-xs">
                    {item.added_by?.role || ""}
                  </p>
                </TableCell>

                <TableCell className="px-2 py-3 text-sm text-right">
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="secondary"
                      className="bg-red-300 hover:bg-red-400 text-xs px-2 py-1 cursor-pointer"
                      onClick={() => DeleteRecord(item.id)}
                    >
                      الحذف
                    </Button>
                    <Button
                      variant="secondary"
                      className="bg-yellow-100 hover:bg-yellow-200 text-xs px-2 py-1 cursor-pointer"
                      onClick={() => editCompany(item.id)}
                    >
                      التعديل
                    </Button>
                    <Button
                      variant="secondary"
                      className="bg-green-300 hover:bg-green-400 text-xs px-2 py-1 cursor-pointer"
                      onClick={() => monyOpertions(item.id)}
                    >
                      عمليات مالية
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="hidden xl:flex items-center justify-center gap-8 mt-4">
        <Pagention
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          totalItems={totalItems}
        />
      </div>

      {/* Mobile Cards (unchanged) */}
      <div className="xl:hidden grid gap-4 overflow-x-hidden">
        {company.map((item, key) => (
          <Card
            key={key}
            className="shadow-md border rounded-xl p-4 space-y-4 w-full max-w-[90%] mx-auto overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 shrink-0">
                <AvatarImage src={`/uploads/${item.photo || "default.jpg"}`} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <CardTitle className="text-lg font-bold text-gray-800 truncate">
                  {item.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 truncate">
                  {item.address}
                </CardDescription>
              </div>
            </div>
            <CardContent className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-700">
              <div>
                <span className="font-semibold text-gray-600">رقم الشركة:</span>
                <div className="truncate">{item.phone}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">الحالة:</span>
                <div className="truncate">{item.status}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  تاريخ الإنشاء:
                </span>
                <div>
                  {new Date(item.createdAt.toString()).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  تاريخ التحديث:
                </span>
                <div>
                  {new Date(item.updatedAt.toString()).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  أضيف بواسطة:
                </span>
                <p>{item.added_by?.name || "غير معروف"}</p>
                <p className="text-gray-500 text-sm">
                  {item.added_by?.role || ""}
                </p>
              </div>
              <div></div>
              <div>
                <span className="font-semibold text-gray-600">
                  مستحقات مالية:
                </span>
                <div className="mt-1">
                  {/* <Badge
                    className={`text-white font-medium rounded-full px-3 py-1 ${
                      calcCompanyBalance(item.transactions) > 0
                        ? "bg-green-600"
                        : calcCompanyBalance(item.transactions) < 0
                        ? "bg-red-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {calcCompanyBalance(item.transactions) > 0
                      ? `دائن: ${calcCompanyBalance(item.transactions)}`
                      : calcCompanyBalance(item.transactions) < 0
                      ? `مدين: ${Math.abs(
                          calcCompanyBalance(item.transactions)
                        )}`
                      : "لا يوجد عمليات"}
                  </Badge> */}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center gap-2 flex-wrap">
              <div className="text-sm text-gray-600 truncate">
                {item.general_alert}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="destructive"
                  className="flex-1 cursor-pointer"
                  onClick={() => DeleteRecord(item.id)}
                >
                  الحذف
                </Button>
                <Button
                  variant="secondary"
                  className="bg-yellow-100 text-black flex-1 cursor-pointer"
                  onClick={() => editCompany(item.id)}
                >
                  التعديل
                </Button>
                <Button
                  variant="secondary"
                  className="bg-green-300 cursor-pointer px-2 py-1 text-sm flex-1 "
                  onClick={() => monyOpertions(item.id)}
                >
                  عمليات مالية
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
        <div className="xl:hidden mt-4">
          <Pagention
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            totalItems={totalItems}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
