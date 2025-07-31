"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { BASE_URL, Treasury, TreasuryTransaction } from "@/apiCaild/API";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/Types/CustomJWTDecoded";

const Page = () => {
  const [transactionType, setTransactionType] = useState("DEPOSIT");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const cookie = Cookie();
  const router = useRouter();
  const token = cookie.get("Bearer");
  const decoded = jwtDecode<DecodedToken>(token);
  const userId = decoded.id;
  const { id } = useParams();

  const { data, mutate } = useSWR(`${BASE_URL}/${Treasury}/${id}`, fetcher);
  const treasury = data?.data || {};
  const totalItems = data?.total || 0;

  const { data: transactionData, mutate: mutateTransaction } = useSWR(
    `${BASE_URL}/${TreasuryTransaction}/${id}?page=${currentPage}&pageSize=${rowsPerPage}`,
    fetcher
  );
  const transactions = transactionData?.data || [];
  console.log(transactions);
  const handleSubmit = async () => {
    if (loading) return;
    if (amount <= 0 || !description) {
      return toast.error("يرجى إدخال المبلغ والبيان بشكل صحيح");
    }

    setLoading(true);
    try {
      const endpoint =
        transactionType === "DEPOSIT"
          ? `${BASE_URL}/Treasury/${id}/deposit`
          : `${BASE_URL}/Treasury/${id}/withdraw`;

      await axios.post(
        endpoint,
        { amount, description, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mutate();
      mutateTransaction();
      toast.success(
        transactionType === "DEPOSIT" ? "تم الإيداع بنجاح" : "تم السحب بنجاح"
      );

      setAmount(0);
      setDescription("");
    } catch {
      toast.error("فشل في تنفيذ العملية");
    } finally {
      setLoading(false);
    }
  };
  const DeleteRecord = async (transactionId: number) => {
    try {
      axios.delete(`${BASE_URL}/${TreasuryTransaction}/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("تم حذف السجل بنجاح");
      mutateTransaction();
    } catch (error) {
      toast.error("خطاء في حذف السجل");
    }
  };
  return (
    <div className="container mt-4" dir="rtl">
      {/* Header */}
      <div className="w-full bg-white rounded-xl px-6 py-4 flex justify-between items-center shadow-sm border-b-2 border-blue-200">
        <h1 className="text-lg font-semibold text-gray-800">
          سجل حركة خزنة: {treasury.name}
        </h1>
        <Button
          className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition"
          onClick={() => router.push("/dashboard/treasury")}
        >
          العودة للخزائن
        </Button>
      </div>

      {/* Current Balance */}
      <Card className="mt-4 shadow-2xl border-0 border-b-4 border-blue-200">
        <CardContent>
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-semibold text-gray-800">
              الرصيد الحالي
            </h1>
            <p>{treasury.balance} ج.م</p>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardContent>
          <div className="text-right mb-10">
            <h1 className="inline-block text-3xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 w-full">
              الحركات المسجلة
            </h1>
          </div>
          <div className="col-span-1 md:col-span-2 overflow-x-auto ">
            <Table className="w-full border text-center">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="min-w-[150px] text-center">
                    التاريخ
                  </TableHead>
                  <TableHead className="min-w-[150px] text-center">
                    البيان
                  </TableHead>
                  <TableHead className="min-w-[100px] text-center">
                    نوع الحركة
                  </TableHead>
                  <TableHead className="min-w-[100px] text-center">
                    المبلغ
                  </TableHead>
                  <TableHead className="min-w-[120px] text-center">
                    المستخدم
                  </TableHead>
                  <TableHead className="min-w-[150px] text-center">
                    إجراء
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transactions.map((tra: any, index: number) => (
                  <TableRow
                    key={`${tra.id}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="text-center">
                      {new Date(tra.createdAt).toLocaleString("ar-EG")}
                    </TableCell>
                    <TableCell className="text-center">
                      {tra.description || "--"}
                    </TableCell>
                    <TableCell className="text-center">
                      {tra.type === "DEPOSIT"
                        ? "إيداع"
                        : tra.type === "WITHDRAWAL"
                        ? "سحب"
                        : tra.type === "RETURN"
                        ? "مرتجع"
                        : "غير معروف"}
                    </TableCell>
                    <TableCell
                      className={`text-center font-medium ${
                        tra.type === "DEPOSIT"
                          ? "text-green-700"
                          : tra.type === "WITHDRAWAL"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {tra.amount} ج.م
                    </TableCell>
                    <TableCell className="text-center">
                      {tra.user?.name || "غير معروف"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          variant="secondary"
                          className="bg-red-300 cursor-pointer px-2 py-1 text-sm"
                          onClick={() => DeleteRecord(tra.id)}
                        >
                          الحذف
                        </Button>
                        <Button
                          variant="secondary"
                          className="bg-yellow-100 cursor-pointer px-2 py-1 text-sm"
                        >
                          التعديل
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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

      {/* Transaction Form */}
      <Card className="mt-10 shadow">
        <CardContent className="w-[70%]">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="w-full">
              <Label htmlFor="transactionType">النوع</Label>
              <select
                id="transactionType"
                className="mt-1 p-2 border rounded w-full"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <option value="DEPOSIT">إيداع</option>
                <option value="WITHDRAWAL">سحب</option>
              </select>
            </div>
            <div className="w-full">
              <Label>المبلغ</Label>
              <Input
                type="number"
                className="w-full"
                value={amount}
                onChange={(e) => setAmount(+e.target.value)}
              />
            </div>
            <div className="w-full">
              <Label>البيان</Label>
              <Input
                type="text"
                className="w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-6">
            <Button
              className="bg-green-600 text-white hover:bg-green-700 transition"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "جارٍ التنفيذ..." : "تنفيذ العملية"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
