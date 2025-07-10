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
  return (
    <div dir="rtl" className="p-4 overflow-hidden">
      <div>
        <div className="hidden xl:flex items-center gap-8">
          <Table className="border  rounded-lg overflow-hidden">
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
                <TableHead className="text-right font-bold text-gray-800">
                  رقم الشركه
                </TableHead>
                <TableHead className="text-right font-bold text-gray-800">
                  عنوان الشركه
                </TableHead>
                <TableHead className="text-right font-bold text-gray-800">
                  الاشعارات
                </TableHead>
                <TableHead className="text-right font-bold text-gray-800">
                  تاريخ الانشاء
                </TableHead>
                <TableHead className="text-right font-bold text-gray-800">
                  تاريخ التحديث
                </TableHead>
                <TableHead className="text-right font-bold text-gray-800">
                  اضيف بواسطه
                </TableHead>
                <TableHead className="text-right font-bold text-gray-800">
                  تم التحديث بواسطه
                </TableHead>
                <TableHead className="text-right font-bold text-gray-800">
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
                  <TableCell className="font-medium">
                    {item.company_code}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="w-12 h-12 rounded-full overflow-hidden border">
                      <Image
                        src={`/uploads/${item.photo || "default.jpg"}`}
                        alt="logo"
                        height={48}
                        width={48}
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell
                    className="max-w-[160px] truncate"
                    title={item.address}
                  >
                    {item.address}
                  </TableCell>
                  <TableCell
                    className="max-w-[160px] truncate"
                    title={item.general_alert}
                  >
                    {item.general_alert}
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt.toString()).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(item.updatedAt.toString()).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{item.added_by_id}</TableCell>
                  <TableCell>{item.updated_by_id}</TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center">
                      <Button
                        variant="secondary"
                        className="bg-red-300 cursor-pointer"
                        onClick={() => DeleteRecord(item.id)}
                      >
                        الحذف
                      </Button>
                      <Button
                        variant="secondary"
                        className="bg-yellow-100 cursor-pointer"
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
        <div className="hidden xl:flex items-center justify-center gap-8">
          <Pagention
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            totalItems={totalItems}
          />
        </div>
      </div>
      {/* mobile card */}
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
                <div>{item.added_by_id}</div>
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
        <div className="xl:hidden ">
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
