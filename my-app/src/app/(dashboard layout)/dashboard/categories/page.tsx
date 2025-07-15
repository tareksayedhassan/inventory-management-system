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
      <div className="hidden xl:flex items-center justify-center overflow-x-auto p-4">
        <div className="min-w-[1100px] w-full">
          <Table className="w-full border border-gray-200 rounded-xl text-sm shadow-sm">
            <TableCaption className="mb-4 font-bold text-lg text-gray-500 text-center px-4 pt-4">
              قائمة الشركات
            </TableCaption>

            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="text-right font-semibold text-gray-800 w-[200px]">
                  اسم القسم
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-800 w-[160px]">
                  تاريخ الإنشاء
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-800 w-[160px]">
                  تاريخ التحديث
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-800 w-[180px]">
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {category.map((item, key) => (
                <TableRow
                  key={key}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <TableCell
                    className="text-right text-gray-800 max-w-[200px] truncate"
                    title={item.name}
                  >
                    {item.name}
                  </TableCell>

                  <TableCell className="text-center text-gray-700">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-center text-gray-700">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs px-3 py-1"
                        onClick={() => DeleteProduct(item.id)}
                      >
                        حذف
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-yellow-100 text-black hover:bg-yellow-200 text-xs px-3 py-1"
                        onClick={() => editProduct(item.id)}
                      >
                        تعديل
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
