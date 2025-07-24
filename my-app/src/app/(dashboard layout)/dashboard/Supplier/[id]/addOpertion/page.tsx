"use client";

import { BASE_URL, Supplier, Treasury } from "@/apiCaild/API";
import { fetcher } from "@/apiCaild/fetcher";
import Loading from "@/components/customUi/loading";

import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Cookie from "cookie-universal";
import { toast } from "sonner";
import { Compny } from "@/Types/company";

const CompanyPage = () => {
  const [treasuries, setTreasuries] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    operationType: "deposit",
    amount: "",
    description: "",
    treasuryId: "",
  });
  const [loading, setLoading] = useState(false);

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

  const company = data?.data ?? {};

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
  const InfoItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <div>
      <span className="block text-sm font-medium text-gray-500 dark:text-neutral-400">
        {label}
      </span>
      <span className="block text-lg text-gray-800 dark:text-neutral-200">
        {value}
      </span>
    </div>
  );

  const BalanceItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <div className="bg-white dark:bg-neutral-900 border rounded-md p-3 text-center shadow-sm">
      <span className="block text-sm text-gray-500 dark:text-neutral-400">
        {label}
      </span>
      <span className="block text-lg font-semibold text-gray-800 dark:text-neutral-200">
        {value || "غير متوفر"}
      </span>
    </div>
  );

  return (
    <div className="container py-8" dir="rtl">
      {/* معلومات الشركة */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 mb-4 border-b pb-2">
          بيانات المورد
        </h1>

        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoItem label=" id المورد " value={company.id || id} />
          <InfoItem label="الاسم" value={company.name || "غير متوفر"} />
          <InfoItem label="رقم الهاتف" value={company.phone || "غير متوفر"} />
          <InfoItem label="العنوان" value={company.address || "غير متوفر"} />
          <InfoItem label="الحالة" value={company.status || "غير متوفر"} />
          <InfoItem
            label="تاريخ الإضافة"
            value={
              company.createdAt
                ? new Date(company.createdAt).toLocaleString("ar-EG")
                : "غير متوفر"
            }
          />

          {/* القسم المالي */}
          <div className="bg-gray-50 dark:bg-neutral-800 rounded-md p-4 col-span-1 md:col-span-2 lg:col-span-3">
            <h2 className="text-md font-semibold text-blue-700 dark:text-blue-400 mb-3">
              التفاصيل المالية
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <BalanceItem label="إجمالي المبلغ" value={company.netBalance} />
              <BalanceItem label="(له) دائن" value={company.debitBalance} />
              <BalanceItem label="(عليه) مدين" value={company.creditBalance} />
            </div>
          </div>
        </div>
      </div>

      {/* الفورم الخاص بالعملية
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200 mb-4">
          إضافة عملية محاسبية
        </h2>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-2xs border border-gray-200 dark:border-neutral-700">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label
                htmlFor="operationType"
                className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1"
              >
                نوع العملية
              </label>
              <select
                id="operationType"
                name="operationType"
                value={formData.operationType}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
              >
                <option value="deposit">إيداع</option>
                <option value="withdrawal">سحب</option>
                <option value="return">مرتجع</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="treasuryId"
                className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1"
              >
                اختر الخزنة
              </label>
              <select
                id="treasuryId"
                name="treasuryId"
                value={formData.treasuryId}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
              >
                <option value="">-- اختر خزنة --</option>
                {treasuries.map((treasury) => (
                  <option key={treasury.id} value={treasury.id}>
                    {treasury.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1"
              >
                المبلغ
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
                placeholder="أدخل المبلغ"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1"
              >
                ملاحظات
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="block w-full rounded-md border border-gray-300 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
                placeholder="ملاحظات إضافية للعملية"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2"
            >
              {loading ? "جاري الإضافة..." : "إضافة العملية"}
            </Button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default CompanyPage;
