"use client";

import {
  BASE_URL,
  Supplier,
  SupplierTransaction,
  Treasury,
} from "@/apiCaild/API";
import { fetcher } from "@/apiCaild/fetcher";
import Loading from "@/components/customUi/loading";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Cookie from "cookie-universal";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PiPencilCircleDuotone } from "react-icons/pi";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { SupplierStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

// مكون EditPartyModal (يُفترض أنه موجود)
const EditPartyModal = ({
  party,
  onClose,
  onSave,
}: {
  party: any;
  onClose: () => void;
  onSave: (data: any) => void;
}) => {
  // يمكنك إضافة تنفيذ المودال هنا أو استيراده
  return null;
};

const formatDateTime = (date: string) => new Date(date).toLocaleString("ar-EG");
const formatCurrency = (amount: number) => `${amount.toFixed(2)} ج.م`;

const CompanyPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/${Supplier}/${id}`,
    fetcher
  );

  const {
    data: TransactionData,
    error: TransactionError,
    isLoading: TransactionisLoading,
    mutate: TransactionMutate,
  } = useSWR(`${BASE_URL}/${SupplierTransaction}/${id}`, fetcher);
  const Transactions = TransactionData?.data ?? [];
  const suppler = data?.data ?? {};
  console.log(Transactions);
  const cookie = Cookie();
  const token = cookie.get("Bearer");

  if (isLoading)
    return (
      <div className="container py-8">
        <Loading />
      </div>
    );
  if (error)
    return <div className="container py-8">خطأ في تحميل بيانات الشركة</div>;

  return (
    <div className="py-8" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full bg-white rounded-xl px-6 py-4 flex justify-between items-center shadow-sm border-b-2 border-blue-200"
      >
        <h1 className="text-lg font-semibold text-gray-800">
          كشف حساب: {suppler.Campname}
        </h1>
        <div className="flex gap-3">
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer flex items-center gap-2"
            // onClick={() => setEditingParty(suppler)}
          >
            <PiPencilCircleDuotone className="w-5 h-5" />
            تعديل البيانات
          </Button>
          <Button
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer"
            onClick={() => router.push("/dashboard/Supplier")}
          >
            العودة للقائمة
          </Button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="mt-5"
      >
        <Card className="shadow-lg border-0 border-b-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold ">
              بيانات المورد - {suppler.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 pt-4 border-t border-blue-100">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p className="text-sm text-gray-500">الاسم الكامل</p>
                <p className="font-semibold text-base">{suppler.name || "-"}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <p className="text-sm text-gray-500">اسم الشركة</p>
                <p className="font-semibold text-base">
                  {suppler.Campname || "-"}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <p className="text-sm text-gray-500">رقم الهاتف</p>
                <p className="font-semibold text-base font-numeric">
                  {suppler.phone || "-"}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="md:col-span-3"
              >
                <p className="text-sm text-gray-500">العنوان</p>
                <p className="font-semibold text-base">
                  {suppler.address || "-"}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <p className="text-sm text-gray-500">الرقم الضريبي</p>
                <p className="font-semibold text-base font-numeric">
                  {suppler.tax_number || "-"}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <p className="text-sm text-gray-500">تاريخ الإنشاء</p>
                <p className="font-semibold text-base font-numeric">
                  {format(
                    toZonedTime(suppler.createdAt, "Africa/Cairo"),
                    "dd/MM/yyyy hh:mm a"
                  )}{" "}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="bg-gray-100 p-3 rounded-lg text-center"
              >
                <div className="text-sm text-gray-500">الرصيد الحالي</div>
                <div
                  className={`text-2xl font-bold font-numeric ${
                    suppler.balance && suppler.balance !== 0
                      ? suppler.balance > 0
                        ? "text-green-500"
                        : "text-red-500"
                      : "text-gray-800"
                  }`}
                >
                  {formatCurrency(Math.abs(suppler.balance || 0))}
                </div>
                {suppler.status === SupplierStatus.creditBalance ? (
                  <Badge className="bg-green-500 text-white">له</Badge>
                ) : suppler.status === SupplierStatus.debitBalance ? (
                  <Badge className="bg-red-500 text-white">عليه</Badge>
                ) : suppler.status === SupplierStatus.neutral ? (
                  <Badge className="bg-blue-400 text-white">صافي حساب</Badge>
                ) : (
                  <Badge className="bg-gray-500 text-white">معلق</Badge>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="md:col-span-3"
              >
                <p className="text-sm text-gray-500">ملاحظات</p>
                <p className="font-semibold text-base whitespace-pre-wrap">
                  {suppler.note || <span>لا توجد ملاحظات</span>}
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        className="mt-5"
      >
        <Card className="shadow-lg border-0 border-b-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold ">سجل الحركات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-base text-right text-gray-800">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">البيان</th>
                    <th className="p-3">دائن (له)</th>
                    <th className="p-3">مدين (عليه)</th>

                    <th className="p-3">الرصيد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Transactions.map((tx: any, index: number) => (
                    <motion.tr
                      key={`${tx.id}-${tx.txType}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    >
                      <td className="p-2">
                        {" "}
                        {format(
                          toZonedTime(tx.createdAt, "Africa/Cairo"),
                          "dd/MM/yyyy hh:mm a"
                        )}
                      </td>
                      <td className="p-2">{tx.description}</td>
                      <td className="p-2 text-green-500 font-numeric text-base font-semibold">
                        {tx.creditBalance
                          ? formatCurrency(tx.creditBalance)
                          : "-"}
                      </td>
                      <td className="p-2 text-red-500 font-numeric text-base font-semibold">
                        {tx.debitBalance
                          ? formatCurrency(tx.debitBalance)
                          : "-"}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-gray-300 font-bold bg-gray-100">
                  <tr>
                    <td colSpan={2} className="p-3 text-right text-lg">
                      الإجماليات
                    </td>
                    <td className="p-3 text-green-500 font-numeric text-base font-semibold">
                      {/* {formatCurrency(totalDebit)} */}
                    </td>
                    <td className="p-3 text-red-500 font-numeric text-base font-semibold">
                      {/* {formatCurrency(totalCredit)} */}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="p-3 text-right text-lg">
                      الرصيد النهائي
                    </td>
                    <td
                      className={`p-3 font-numeric text-lg font-bold ${
                        Transactions.balance > 0
                          ? "text-green-600"
                          : Transactions.balance < 0
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {formatCurrency(Math.abs(suppler.balance || 0))}
                      <span className="text-sm ms-1 font-semibold">
                        {suppler.balance
                          ? suppler.balance > 0
                            ? "عليه (مدين)"
                            : suppler.balance < 0
                            ? "له (دائن)"
                            : "مسدد"
                          : ""}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CompanyPage;
