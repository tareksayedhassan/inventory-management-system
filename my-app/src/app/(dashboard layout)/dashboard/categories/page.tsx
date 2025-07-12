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
import { BASE_URL, Categories } from "@/apiCaild/API";
import { fetcher } from "@/apiCaild/fetcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Cookie from "cookie-universal";
import Pagention from "@/components/customUi/pagention";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loading from "@/components/customUi/loading";
import Link from "next/link";
import { Input } from "@/components/ui/input";
interface ICategory {
  id: number;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const [searchQuery, setSearchQuery] = useState("");
  // improve search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);
  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/${Categories}?page=${currentPage}&pageSize=${rowsPerPage}&search=${searchQuery}`,
    fetcher
  );
  if (isLoading) return <div>{<Loading />}</div>;
  console.log(data);
  const category: ICategory[] = data?.data || [];
  const router = useRouter();
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const DeleteProduct = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/${Categories}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      mutate();
      toast.info("categories deleted successfully");
    } catch (error) {
      toast.error("Faild to delete categories");
    }
  };

  const editProduct = (id: number) => {
    router.push(`/dashboard/categories/${id}`);
  };

  return (
    <div dir="rtl" className="p-4 overflow-scroll">
      {/* رأس الجدول: زر إضافة + البحث */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-4 mb-4">
        <Link href={"/dashboard/categories/add"}>
          <Button
            variant="secondary"
            className="hover:bg-amber-100 w-full xl:w-auto"
          >
            اضافه قسم جديد
          </Button>
        </Link>

        <div className="w-full max-w-sm">
          <Input
            type="search"
            placeholder="ابحث باسم القسم..."
            className="rounded-lg border border-gray-300 px-4 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full overflow-x-auto rounded-lg shadow">
        <div className="min-w-full">
          <Table className="w-full border rounded-lg text-sm">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[50px] text-center font-bold">
                  #
                </TableHead>
                <TableHead className="font-bold text-right">
                  اسم القسم
                </TableHead>
                <TableHead className="w-[140px] text-center font-bold">
                  تاريخ الإضافة
                </TableHead>
                <TableHead className="w-[140px] text-center font-bold">
                  تاريخ التحديث
                </TableHead>
                <TableHead className="w-[140px] text-center font-bold">
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {category.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="text-center font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-right">{item.name}</TableCell>
                  <TableCell className="text-center">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs px-3"
                        onClick={() => DeleteProduct(item.id)}
                      >
                        حذف
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-yellow-100 text-black hover:bg-yellow-200 text-xs px-3"
                        onClick={() => editProduct(item.id)}
                      >
                        تعديل
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableCaption className="mt-4 font-semibold text-gray-500">
              قائمة أقسام الأصناف الموجودة
            </TableCaption>
          </Table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="xl:hidden grid gap-4 p-4">
        {category.map((item, key) => (
          <Card
            key={key}
            className="shadow-md border border-gray-200 rounded-2xl p-4 space-y-4 w-full"
          >
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base font-bold text-gray-800">
                  {item.name}
                </CardTitle>
              </div>
            </div>

            <CardContent className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-700">
              <div>
                <span className="font-semibold text-gray-600">
                  تاريخ الإضافة:
                </span>
                <div>{new Date(item.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  تاريخ التحديث:
                </span>
                <div>{new Date(item.updatedAt).toLocaleDateString()}</div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center flex-wrap gap-3 pt-2">
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => DeleteProduct(item.id)}
                >
                  الحذف
                </Button>
                <Button
                  variant="secondary"
                  className="bg-yellow-100 text-black flex-1"
                  onClick={() => editProduct(item.id)}
                >
                  التعديل
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="xl:hidden">
        <Pagention
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
};

export default Page;
