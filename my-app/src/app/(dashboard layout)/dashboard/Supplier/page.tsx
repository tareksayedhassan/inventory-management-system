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

  const supplier: Compny[] = data?.data || [];
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

  return (
    <div dir="rtl" className="p-4">
      <Card>
        <CardContent>
          <div className="w-full overflow-x-hidden">
            <div className="overflow-hidden rounded-lg shadow">
              <Table className="min-w-full divide-y divide-gray-200 text-sm">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="px-3 py-2 text-center min-w-[90px]">
                      الاسم
                    </TableHead>
                    <TableHead className="px-3 py-2 text-center min-w-[120px]">
                      اسم الشركه
                    </TableHead>
                    <TableHead className="px-3 py-2 text-center min-w-[70px]">
                      رقم الهاتف
                    </TableHead>
                    <TableHead className="px-3 py-2 text-center min-w-[70px] hidden sm:table-cell">
                      الرصيد
                    </TableHead>
                    <TableHead className="px-3 py-2 text-center min-w-[120px] hidden md:table-cell">
                      الحاله{" "}
                    </TableHead>
                    <TableHead className="px-3 py-2 text-center min-w-[110px]">
                      إجراء
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplier.map((tra: any, index: number) => (
                    <TableRow
                      key={`${tra.id}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="px-3 py-2 text-center">
                        {new Date(tra.createdAt).toLocaleDateString("ar-EG")}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center">
                        {tra.description || "--"}
                      </TableCell>
                      <TableCell
                        className={`px-3 py-2 text-center font-medium ${
                          ["Eda3_mobasher", "Tahseel_mn_3ameel"].includes(
                            tra.type
                          )
                            ? "text-green-700"
                            : ["Sa7b_mobasher", "Sadad_le_moored"].includes(
                                tra.type
                              )
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {tra.amount} ج.م
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center hidden sm:table-cell">
                        {tra.method === "cash"
                          ? "كاش"
                          : tra.method === "transfer"
                          ? "تحويل"
                          : tra.method === "check"
                          ? "شيك"
                          : tra.method || "__"}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center hidden md:table-cell">
                        {tra.reference || "--"}
                      </TableCell>

                      <TableCell className="px-3 py-2 text-center hidden lg:table-cell">
                        {tra.user?.name || "غير معروف"}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center">
                        <div className="flex justify-center items-center gap-2 flex-wrap">
                          <Button
                            variant="secondary"
                            className="bg-red-300 px-3 py-1 text-sm"
                            onClick={() => DeleteRecord(tra.id)}
                          >
                            الحذف
                          </Button>
                          <Button
                            variant="secondary"
                            className="bg-yellow-100 px-3 py-1 text-sm"
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
