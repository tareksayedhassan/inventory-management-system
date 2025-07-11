"use client";
import React, { useState } from "react";
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
import { BASE_URL, Company, DELETE_CMPANY } from "@/apiCaild/API";
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
const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/${Company}?page=${currentPage}&pageSize=${rowsPerPage}&search=${search}`,
    fetcher
  );
  if (isLoading) return <div>{<Loading />}</div>;

  const company: Compny[] = data?.data || [];
  const router = useRouter();
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const DeleteRecord = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/${DELETE_CMPANY}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      mutate();
      toast.info("company deleted successfully");
    } catch (error) {
      toast.error("Faild to delete Company");
    }
  };

  const editCompany = (id: number) => {
    router.push(`/dashboard/companies/${id}`);
  };
  const getImageUrl = (photo: string | undefined) => {
    if (!photo) return "/uploads/default.jpg";
    return `/uploads/${photo}`;
  };

  console.log(data);
  return (
    <div dir="rtl" className="p-4">
      {/* Desktop Table */}
      <div className="hidden xl:flex items-center gap-8 overflow-x-auto">
        <div className="min-w-[1100px]">
          <Table className="border rounded-lg">
            <TableCaption className="mb-4 font-semibold text-lg text-gray-500">
              قائمة الشركات
            </TableCaption>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[100px] font-bold text-gray-800">
                  رقم النظام
                </TableHead>
                <TableHead className="font-bold text-gray-800">
                  الصوره
                </TableHead>
                <TableHead className="font-bold text-gray-800">
                  الحاله
                </TableHead>
                <TableHead className="font-bold text-gray-800">
                  رقم الشركه
                </TableHead>
                <TableHead className="font-bold text-gray-800 max-w-[160px] truncate">
                  عنوان الشركه
                </TableHead>
                <TableHead className="font-bold text-gray-800 max-w-[160px] truncate">
                  الاشعارات
                </TableHead>
                <TableHead className="font-bold text-gray-800">
                  تاريخ الانشاء
                </TableHead>
                <TableHead className="font-bold text-gray-800">
                  تاريخ التحديث
                </TableHead>
                <TableHead className="font-bold text-gray-800 max-w-[140px] truncate">
                  اضيف بواسطه
                </TableHead>
                <TableHead className="font-bold text-gray-800">
                  تم التحديث بواسطه
                </TableHead>
                <TableHead className="font-bold text-gray-800">
                  التعديل والحذف
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {company.map((item, key) => (
                <TableRow
                  key={key}
                  className="hover:bg-gray-50 transition duration-200 mr-3.5"
                >
                  <TableCell className="w-[90px] font-medium">
                    {item.company_code}
                  </TableCell>

                  <TableCell>
                    <div className="w-12 h-12 rounded-full overflow-hidden border">
                      <Image
                        src={`/uploads/${item.photo || "default.jpg"}`}
                        alt={item.general_alert || "company avatar"}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        quality={100}
                        priority
                        unoptimized
                      />
                    </div>
                  </TableCell>

                  <TableCell className="w-[80px]">{item.status}</TableCell>
                  <TableCell className="w-[120px]">{item.phone}</TableCell>

                  <TableCell
                    className="max-w-[140px] truncate"
                    title={item.address}
                  >
                    {item.address}
                  </TableCell>

                  <TableCell
                    className="max-w-[140px] truncate"
                    title={item.general_alert}
                  >
                    {item.general_alert}
                  </TableCell>

                  <TableCell className="w-[110px]">
                    {new Date(item.createdAt.toString()).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="w-[110px]">
                    {new Date(item.updatedAt.toString()).toLocaleDateString()}
                  </TableCell>

                  <TableCell
                    className="max-w-[140px] truncate"
                    title={item.added_by?.name}
                  >
                    <p>{item.added_by?.name || "غير معروف"}</p>
                    <p className="text-gray-500 text-sm">
                      {item.added_by?.role || ""}
                    </p>
                  </TableCell>

                  <TableCell className="w-[100px] truncate">
                    {item.updated_by_id}
                  </TableCell>

                  <TableCell className="w-[160px]">
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        variant="secondary"
                        className="bg-red-300 cursor-pointer px-2 py-1 text-sm"
                        onClick={() => DeleteRecord(item.id)}
                      >
                        الحذف
                      </Button>
                      <Button
                        variant="secondary"
                        className="bg-yellow-100 cursor-pointer px-2 py-1 text-sm"
                        onClick={() => editCompany(item.id)}
                      >
                        التعديل
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="hidden xl:flex items-center justify-center gap-8">
        <Pagention
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          totalItems={totalItems}
        />
      </div>

      {/* Mobile Cards */}
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
                  {item.company_code}
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
              <div>
                <span className="font-semibold text-gray-600">
                  تم تحديثه بواسطة:
                </span>
                <div>{item.updated_by_id}</div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center gap-2 flex-wrap">
              <div className="text-sm text-gray-600 truncate">
                {item.general_alert}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => DeleteRecord(item.id)}
                >
                  الحذف
                </Button>
                <Button
                  variant="secondary"
                  className="bg-yellow-100 text-black flex-1"
                >
                  التعديل
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
        <div className="xl:hidden">
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
