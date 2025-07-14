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
import { BASE_URL, Treasury } from "@/apiCaild/API";
import { fetcher } from "@/apiCaild/fetcher";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Cookie from "cookie-universal";
import Pagention from "@/components/customUi/pagention";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loading from "@/components/customUi/loading";
import { Input } from "@/components/ui/input";
import Link from "next/link";
interface ITreasury {
  id: number;
  name: string;
  is_master: boolean;
  last_exchange_receipt_number: number;
  last_collect_receipt_number: number;
  createdAt: string;
  updatedAt: string;
  added_by?: {
    name?: string;
    role?: string;
  };
  updated_by_id?: number;
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
    `${BASE_URL}/${Treasury}?page=${currentPage}&pageSize=${rowsPerPage}&search=${searchQuery}`,
    fetcher
  );
  if (isLoading) return <div>{<Loading />}</div>;
  console.log(data);
  const treasury: ITreasury[] = data?.data || [];
  const router = useRouter();
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const DeleteRecord = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/${Treasury}/${id}`, {
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
    router.push(`/dashboard/treasury/${id}`);
  };

  const showTreasury = (id: number) => {
    router.push(`/dashboard/treasury/${id}/showData`);
  };
  return (
    <div dir="rtl" className="p-4">
      <div className="flex justify-between items-center mb-2.5">
        <Link href={"/dashboard/treasury/add"}>
          <Button
            variant="secondary"
            className="cursor-pointer hover:bg-amber-50"
          >
            اضافه خزنه
          </Button>
        </Link>
        <div className="w-full max-w-sm">
          <Input
            type="search"
            placeholder="ابحث باسم الخزينه..."
            className="rounded-lg border border-gray-300 px-4 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="hidden xl:flex items-center gap-8 overflow-x-auto">
        <Table className="border rounded-lg">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[40px] text-center font-bold text-gray-800">
                تسلسل
              </TableHead>
              <TableHead className="font-bold text-gray-800">
                اسم الخزنة
              </TableHead>
              <TableHead className="font-bold text-gray-800">رئيسية؟</TableHead>
              <TableHead className="font-bold text-gray-800">
                آخر إيصال صرف
              </TableHead>
              <TableHead className="font-bold text-gray-800">
                آخر إيصال تحصيل
              </TableHead>
              <TableHead className="font-bold text-gray-800">
                تاريخ الإضافة
              </TableHead>
              <TableHead className="font-bold text-gray-800">
                تاريخ التحديث
              </TableHead>
              <TableHead className="font-bold text-gray-800">
                أضيفت بواسطة
              </TableHead>
              <TableHead className="font-bold text-gray-800">
                تم التحديث بواسطة
              </TableHead>
              <TableHead className="font-bold text-gray-800">
                التعديل والحذف
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {treasury.map((item, index) => (
              <TableRow
                key={index}
                className="hover:bg-gray-50 transition duration-200"
              >
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.is_master ? "نعم" : "لا"}</TableCell>
                <TableCell>{item.last_exchange_receipt_number}</TableCell>
                <TableCell>{item.last_collect_receipt_number}</TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(item.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <p>{item.added_by?.name || "غير معروف"}</p>
                  <p className="text-gray-500 text-sm">
                    {item.added_by?.role || ""}
                  </p>
                </TableCell>
                <TableCell>{item.updated_by_id || "غير معروف"}</TableCell>
                <TableCell>
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
                    <Button
                      variant="secondary"
                      className="bg-yellow-100 cursor-pointer px-2 py-1 text-sm"
                      onClick={() => showTreasury(item.id)}
                    >
                      بيانات الخزنه
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableCaption className="mt-4 font-semibold text-lg text-gray-500">
            الخزن المُسجلة
          </TableCaption>
        </Table>
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
      <div className="xl:hidden grid gap-4 p-4">
        {treasury.map((item, key) => (
          <Card
            key={key}
            className="shadow-md border border-gray-200 rounded-2xl p-4 space-y-4 w-full"
          >
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base font-bold text-gray-800">
                  {item.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {item.is_master ? "خزنة رئيسية" : "خزنة فرعية"}
                </CardDescription>
              </div>
            </div>

            <CardContent className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-700">
              <div>
                <span className="font-semibold text-gray-600">
                  آخر إيصال تحصيل:
                </span>
                <div>{item.last_collect_receipt_number}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  آخر إيصال صرف:
                </span>
                <div>{item.last_exchange_receipt_number}</div>
              </div>
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
              <div className="col-span-2">
                <span className="font-semibold text-gray-600">
                  أضيف بواسطة:
                </span>
                <div className="text-sm">
                  <p>{item.added_by?.name || "غير معروف"}</p>
                  <p className="text-gray-500 text-xs">
                    {item.added_by?.role || ""}
                  </p>
                </div>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-gray-600">
                  تم التحديث بواسطة:
                </span>
                <div>{item.updated_by_id || "غير معروف"}</div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center flex-wrap gap-3 pt-2">
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
                  onClick={() => editCompany(item.id)}
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
