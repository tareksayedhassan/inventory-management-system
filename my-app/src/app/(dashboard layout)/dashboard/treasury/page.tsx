"use client";
import React, { useEffect, useState } from "react";

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
import Link from "next/link";

interface ITreasury {
  id: number;
  name: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  added_by?: {
    name?: string;
    role?: string;
  };
}
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/Types/CustomJWTDecoded";
import { MdDeleteForever } from "react-icons/md";

const Page = () => {
  const [name, setName] = useState<string>("");
  const [balance, setbalance] = useState<number>(0);
  const [userId, setUserId] = useState<number | null>(null);

  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const router = useRouter();

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log(decoded);

      if (typeof decoded.id === "number") {
        console.log(decoded.id);

        setUserId(decoded.id);
      } else {
        toast.error("User ID is invalid.");
      }
    }
  }, [token]);
  const handilSubmit = async () => {
    if (userId === null) {
      toast.error("حدث خطأ: لا يمكن تحديد المستخدم.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("balance", `${balance}`);
    formData.append("added_by_id", userId.toString());

    try {
      await axios.post(`${BASE_URL}/${Treasury}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("تم اضافه الخزنه بنجاح واضافه الرصيد الافتتاحي");
      mutate();
      setName("");
      setbalance(0);
    } catch (error: any) {
      console.error("خطأ في عملية اضافه  الخزنة:", error);
      toast.error(
        error?.response?.data?.message || "فشل في تنفيذ عملية الإضافة."
      );
    }
  };

  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/${Treasury}`,
    fetcher
  );
  if (isLoading) return <div>{<Loading />}</div>;
  console.log(data);
  const treasury: ITreasury[] = data?.data || [];
  const DeleteRecord = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/${Treasury}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      mutate();
      toast.info("Treasury deleted successfully");
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
      <Card className="bg-[#f9f9f9]">
        <p className="text-xl font-semibold text-gray-800 mr-3 border-b-2 border-blue-200 pb-3.5">
          الخزائن الحالية
        </p>
        <div className="w-[70%] mr-4">
          <Table className="table-fixed">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[33%] text-right">اسم الخزنة</TableHead>
                <TableHead className="w-[33%] text-right">
                  الرصيد الحالي
                </TableHead>
                <TableHead className="w-[33%] text-center">الإجراء</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {treasury.map((item, key) => (
                <TableRow key={key}>
                  <TableCell className="w-[33%] font-bold text-right truncate">
                    {item.name}
                  </TableCell>
                  <TableCell className="w-[33%] text-right font-bold truncate">
                    {item.balance}
                  </TableCell>
                  <TableCell className="w-[33%]">
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs cursor-pointer "
                        onClick={() => showTreasury(item.id)}
                      >
                        عرض الحركات
                      </Button>

                      <button
                        onClick={() => DeleteRecord(item.id)}
                        className="text-red-600 hover:text-red-800  cursor-pointer font-extrabold text-4xl"
                        title="حذف الخزنة"
                      >
                        <MdDeleteForever />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="mt-8">
        <p className="text-xl font-semibold text-gray-800 mr-3 border-b-2 border-blue-200 pb-3.5">
          إضافة خزنة جديدة
        </p>
        <hr />
        <div className="flex justify-center items-center mt-6">
          <div className="flex flex-wrap gap-4 w-full max-w-6xl px-4" dir="rtl">
            {/* اسم الخزنة */}
            <div className="flex flex-col w-full sm:w-[30%]">
              <Label className="mb-2 text-right text-lg font-medium text-gray-700">
                اسم الخزنة
              </Label>
              <Input
                className="h-14 text-lg px-4"
                placeholder="ادخل اسم الخزنة"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* الرصيد الافتتاحي */}
            <div className="flex flex-col w-full sm:w-[30%]">
              <Label className="mb-2 text-right text-lg font-medium text-gray-700">
                الرصيد الافتتاحي
              </Label>
              <Input
                className="h-14 text-lg px-4"
                placeholder="ادخل الرصيد"
                type="number"
                value={balance}
                onChange={(e) => setbalance(Number(e.target.value))}
              />
            </div>

            {/* الزرار */}
            <div className="flex items-end w-full sm:w-[20%]">
              <Button
                onClick={handilSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg h-14 w-full cursor-pointer"
              >
                اضافه الخزنة
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Page;
