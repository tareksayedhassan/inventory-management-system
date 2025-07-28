"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";
import { BASE_URL, Treasury } from "@/apiCaild/API";
import { fetcher } from "@/apiCaild/fetcher";
import axios from "axios";
import Cookie from "cookie-universal";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Pagention from "@/components/customUi/pagention";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const Page = () => {
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositDesc, setDepositDesc] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawDesc, setWithdrawDesc] = useState("");
  const [returnAmount, setReturnAmount] = useState(0);
  const [returnDesc, setReturnDesc] = useState("");

  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [loadingReturn, setLoadingReturn] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const cookie = Cookie();
  const router = useRouter();
  const token = cookie.get("Bearer");
  const { id } = useParams();

  const { data } = useSWR(`${BASE_URL}/${Treasury}/${id}`, fetcher);
  const treasury = data?.data || {};
  const totalItems = data?.total || 0;

  console.log(treasury);
  const handleDeposit = async () => {
    if (loadingDeposit) return;
    setLoadingDeposit(true);
    try {
      await axios.post(
        `${BASE_URL}/Treasury/${id}/deposit`,
        { amount: depositAmount, description: depositDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("تم الإيداع بنجاح");
      setDepositAmount(0);
      setDepositDesc("");
    } catch {
      toast.error("فشل في عملية الإيداع");
    } finally {
      setLoadingDeposit(false);
    }
  };

  const handleWithdraw = async () => {
    if (loadingWithdraw) return;
    setLoadingWithdraw(true);
    try {
      await axios.post(
        `${BASE_URL}/Treasury/${id}/withdraw`,
        { amount: withdrawAmount, description: withdrawDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("تم السحب بنجاح");
      setWithdrawAmount(0);
      setWithdrawDesc("");
    } catch {
      toast.error("فشل في عملية السحب");
    } finally {
      setLoadingWithdraw(false);
    }
  };

  return (
    <div className="container  mt-10" dir="rtl">
      <div className="w-full bg-white rounded-xl px-6 py-4 flex justify-between items-center shadow-sm border-b-2 border-blue-200">
        <h1 className="text-lg font-semibold text-gray-800">
          سجل حركة خزنة: الخزنة الرئيسية
        </h1>
        <Button
          className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition"
          onClick={() => router.push("/dashboard/treasury")}
        >
          العودة للخزائن
        </Button>
      </div>
      <Card className="mt-10 shadow-2xl border-0 border-b-4 border-blue-200">
        <CardContent>
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-semibold text-gray-800">
              الرصيد الحالي
            </h1>
            <p>{treasury.balance}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardContent>
          <div className="text-right mb-10">
            <h1 className="inline-block text-3xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 w-full">
              الحركات المسجلة
            </h1>
          </div>
          <div className="col-span-1 md:col-span-2 overflow-x-auto">
            <Table className="w-full border text-center">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="min-w-[150px] text-center">
                    التاريخ{" "}
                  </TableHead>
                  <TableHead className="min-w-[100px] text-center">
                    البيان
                  </TableHead>
                  <TableHead className="min-w-[80px] text-center">
                    المستخدم{" "}
                  </TableHead>
                  <TableHead className="min-w-[150px] text-center">
                    اجراء{" "}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* {product.map((pro: any, index: number) => (
                  <TableRow
                    key={`${pro.name}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="text-center">{pro.name}</TableCell>
                    <TableCell className="text-center">
                      {pro.productCode}
                    </TableCell>
                    <TableCell className="text-center">{pro.stock}</TableCell>
                    <TableCell className="text-center">
                      {pro.note || "--"}
                    </TableCell>
                    <TableCell className="text-center font-medium text-green-700">
                      {pro.price} ج.م
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          variant="secondary"
                          className="bg-red-300 cursor-pointer px-2 py-1 text-sm"
                          onClick={() => DeleteRecord(pro.id)}
                        >
                          الحذف
                        </Button>
                        <Button
                          variant="secondary"
                          className="bg-yellow-100 cursor-pointer px-2 py-1 text-sm"
                        >
                          التعديل
                        </Button>
                      </div>{" "}
                    </TableCell>
                  </TableRow>
                ))}
                */}
              </TableBody>
            </Table>
            <Pagention
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              rowsPerPage={rowsPerPage}
              totalItems={totalItems}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
