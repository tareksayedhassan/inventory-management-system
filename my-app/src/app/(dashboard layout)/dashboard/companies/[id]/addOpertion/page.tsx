"use client";

import { BASE_URL, Company, Treasury } from "@/apiCaild/API";
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
    treasuryId: "", // ✅ خزنة مرتبطة بالعملية
  });
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const id = params?.id as string;

  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/${Company}/${id}`,
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

  const company = (data?.data ?? {}) as Compny;

  const cookie = Cookie();
  const token = cookie.get("Bearer");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("الرجاء إدخال مبلغ صحيح أكبر من صفر");
      return;
    }

    if (!token) {
      toast.error("غير قادر على تنفيذ العملية - التوكن غير موجود");
      return;
    }

    setLoading(true);
    type OperationType = "deposit" | "withdrawal" | "return";

    const endpointMap: Record<OperationType, string> = {
      deposit: `${BASE_URL}/companies/${id}/deposit`,
      withdrawal: `${BASE_URL}/companies/${id}/withdraw`,
      return: `${BASE_URL}/companies/${id}/return`,
    };

    try {
      const operationType = formData.operationType as OperationType;
      const endpoint = endpointMap[operationType];
      await axios.post(
        endpoint,
        {
          amount: Number(formData.amount),
          description: formData.description,
          companyId: company?.id ?? id,
          treasuryId: Number(formData.treasuryId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        operationType === "deposit"
          ? "تم الإيداع بنجاح"
          : operationType === "withdrawal"
          ? "تم السحب بنجاح"
          : "تم المرتجع بنجاح"
      );

      setFormData({
        operationType: "deposit",
        amount: "",
        description: "",
        treasuryId: "",
      });
      mutate();
    } catch (error) {
      toast.error(
        formData.operationType === "deposit"
          ? "فشل في عملية الإيداع"
          : formData.operationType === "withdrawal"
          ? "فشل في عملية السحب"
          : "فشل في عملية المرتجع"
      );
    } finally {
      setLoading(false);
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
    <div className="container py-8" dir="rtl">
      {/* معلومات الشركة */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200">
          بيانات العملاء / الموردين
        </h1>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-neutral-500">
              معرف العميل / المورد
            </span>
            <span className="block text-lg text-gray-800 dark:text-neutral-200">
              {company.id || id}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-neutral-500">
              الاسم
            </span>
            <span className="block text-lg text-gray-800 dark:text-neutral-200">
              {company.name || "غير متوفر"}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-neutral-500">
              رقم الهاتف
            </span>
            <span className="block text-lg text-gray-800 dark:text-neutral-200">
              {company.phone || "غير متوفر"}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-neutral-500">
              العنوان
            </span>
            <span className="block text-lg text-gray-800 dark:text-neutral-200">
              {company.address || "غير متوفر"}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-neutral-500">
              الحالة
            </span>
            <span className="block text-lg text-gray-800 dark:text-neutral-200">
              {company.status || "غير متوفر"}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-neutral-500">
              الإشعار العام
            </span>
            <span className="block text-lg text-gray-800 dark:text-neutral-200">
              {company.general_alert || "غير متوفر"}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-neutral-500">
              مستحقات ماليه
            </span>
            <span className="block text-lg text-gray-800 dark:text-neutral-200">
              {company.transactions || "غير متوفر"}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-neutral-500">
              تاريخ الإنشاء
            </span>
            <span className="block text-lg text-gray-800 dark:text-neutral-200">
              {company.createdAt
                ? new Date(company.createdAt).toLocaleString("ar-EG")
                : "غير متوفر"}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-neutral-500">
              تاريخ التحديث
            </span>
            <span className="block text-lg text-gray-800 dark:text-neutral-200">
              {company.updatedAt
                ? new Date(company.updatedAt).toLocaleString("ar-EG")
                : "غير متوفر"}
            </span>
          </div>
        </div>

        {company.photo && (
          <div className="mt-4">
            <span className="block text-sm font-medium text-gray-500 dark:text-neutral-500">
              الصورة
            </span>
            <Image
              src={`/uploads/${company.photo || "default.jpg"}`}
              width={128}
              height={128}
              quality={100}
              alt={company.name || "صورة الشركة"}
              className="mt-2 h-32 w-32 object-contain rounded-md bg-gray-100"
            />
          </div>
        )}
      </div>

      {/* الفورم الخاص بالعملية */}
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
      </div>
    </div>
  );
};

export default CompanyPage;
