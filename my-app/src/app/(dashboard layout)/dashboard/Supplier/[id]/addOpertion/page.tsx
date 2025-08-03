"use client";

import { BASE_URL, Supplier, Treasury } from "@/apiCaild/API";
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

// وظائف تنسيق افتراضية (يجب استبدالها بالوظائف الحقيقية إذا كانت موجودة)
const formatDate = (date: string) => new Date(date).toLocaleDateString("ar-EG");
const formatDateTime = (date: string) => new Date(date).toLocaleString("ar-EG");
const formatCurrency = (amount: number) => `${amount.toFixed(2)} ج.م`;

const CompanyPage = () => {
  const [treasuries, setTreasuries] = useState<any[]>([]);
  const [editingParty, setEditingParty] = useState<any | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/${Supplier}/${id}`,
    fetcher
  );

  useEffect(() => {
    axios
      .get(`${BASE_URL}/${Treasury}`)
      .then((res) => setTreasuries(res.data?.data || []))
      .catch((err) => {
        console.error("خطأ في تحميل الخزن", err);
        toast.error("فشل تحميل بيانات الخزن");
      });
  }, []);

  const suppler = data?.data ?? {};

  const cookie = Cookie();
  const token = cookie.get("Bearer");

  // بيانات حركات افتراضية (يجب استبدالها ببيانات حقيقية)
  const partyTransactions = [
    {
      id: 1,
      txType: "payment",
      date: "2025-08-01",
      description: "دفعة مقدمة",
      debit: 1000,
      credit: 0,
      runningBalance: 1000,
    },
    {
      id: 2,
      txType: "invoice",
      date: "2025-08-02",
      description: "فاتورة شراء",
      debit: 0,
      credit: 500,
      runningBalance: 500,
    },
  ];
  const totalDebit = partyTransactions.reduce(
    (sum, tx) => sum + (tx.debit || 0),
    0
  );
  const totalCredit = partyTransactions.reduce(
    (sum, tx) => sum + (tx.credit || 0),
    0
  );

  const handleEditSave = async (updatedData: any) => {
    try {
      await axios.put(`${BASE_URL}/${Supplier}/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      mutate(); // إعادة تحميل البيانات بعد التعديل
      setEditingParty(null);
      toast.success("تم تعديل بيانات المورد بنجاح");
    } catch (err) {
      console.error("خطأ في تعديل البيانات", err);
      toast.error("فشل تعديل بيانات المورد");
    }
  };

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
      {editingParty && (
        <EditPartyModal
          party={editingParty}
          onClose={() => setEditingParty(null)}
          onSave={handleEditSave}
        />
      )}
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
            onClick={() => setEditingParty(suppler)}
          >
            <PiPencilCircleDuotone className="w-5 h-5" />
            تعديل البيانات
          </Button>
          <Button
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer"
            onClick={() => router.push("/dashboard/treasury")}
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
        <Card className="shadow-lg border-none bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-800">
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
                  {suppler.created_at ? formatDate(suppler.created_at) : "-"}
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
                <div className="text-sm font-semibold">
                  {suppler.balance
                    ? suppler.balance > 0
                      ? "عليه (مدين)"
                      : suppler.balance < 0
                      ? "له (دائن)"
                      : "مسدد"
                    : ""}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="md:col-span-3"
              >
                <p className="text-sm text-gray-500">ملاحظات</p>
                <p className="font-semibold text-base whitespace-pre-wrap">
                  {suppler.note || "-"}
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
        <Card className="shadow-lg border-none bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-800">
              سجل الحركات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-base text-right text-gray-800">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">البيان</th>
                    <th className="p-3">مدين (عليه)</th>
                    <th className="p-3">دائن (له)</th>
                    <th className="p-3">الرصيد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {partyTransactions.map((tx, index) => (
                    <motion.tr
                      key={`${tx.id}-${tx.txType}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    >
                      <td className="p-2">{formatDateTime(tx.date)}</td>
                      <td className="p-2">{tx.description}</td>
                      <td className="p-2 text-green-500 font-numeric text-base font-semibold">
                        {tx.debit ? formatCurrency(tx.debit) : "-"}
                      </td>
                      <td className="p-2 text-red-500 font-numeric text-base font-semibold">
                        {tx.credit ? formatCurrency(tx.credit) : "-"}
                      </td>
                      <td
                        className={`p-2 font-numeric text-base font-bold ${
                          tx.runningBalance > 0
                            ? "text-green-600"
                            : tx.runningBalance < 0
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        {formatCurrency(Math.abs(tx.runningBalance))}
                        <span className="text-xs ms-1">
                          {tx.runningBalance > 0
                            ? "عليه"
                            : tx.runningBalance < 0
                            ? "له"
                            : ""}
                        </span>
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
                      {formatCurrency(totalDebit)}
                    </td>
                    <td className="p-3 text-red-500 font-numeric text-base font-semibold">
                      {formatCurrency(totalCredit)}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="p-3 text-right text-lg">
                      الرصيد النهائي
                    </td>
                    <td
                      className={`p-3 font-numeric text-lg font-bold ${
                        suppler.balance > 0
                          ? "text-green-600"
                          : suppler.balance < 0
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
