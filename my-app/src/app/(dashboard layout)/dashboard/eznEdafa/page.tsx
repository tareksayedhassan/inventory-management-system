"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  BASE_URL,
  EznEdafa,
  Products,
  Supplier as SupplierEndpoint,
} from "@/apiCaild/API";
import { DecodedToken } from "@/Types/CustomJWTDecoded";
import { IoIosAddCircleOutline } from "react-icons/io";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import Cookie from "cookie-universal";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Product } from "@/Types/company";
import Alert from "@/components/customUi/Alert";
import SelectedData from "@/components/customUi/SelctedData";
import { useReactToPrint } from "react-to-print";
import PrintableComponent from "@/components/customUi/PrintComponent";

// ========== Types ==========
type Supplier = { id: number; name: string };
const Page = () => {
  const [totalAmount, settotalAmount] = useState(0);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isTaxed, setIsTaxed] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isTaxChecked, setIsTaxChecked] = useState(false);
  const [description, setdescription] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<
    (Product & { amount: number; buyPrice: number })[]
  >([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const [quantity, setquantity] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(
    null
  );
  const [userId, setUserId] = useState<number | null>(null);

  const printRef = useRef<HTMLDivElement>(null);
  const cookie = Cookie();
  const token = cookie.get("Bearer");

  // ========== Get User ID ==========
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (typeof decoded.id === "number") {
          setUserId(decoded.id);
        } else {
          toast.error("معرّف المستخدم غير صالح.");
        }
      } catch {
        toast.error("فشل في فك الشفرة.");
      }
    }
  }, [token]);

  useEffect(() => {
    setIsTaxed(isTaxChecked);
  }, [isTaxChecked]);

  // ========== Fetch Data ==========
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, productsRes] = await Promise.all([
          fetch(`${BASE_URL}/${SupplierEndpoint}`).then((res) => res.json()),
          fetch(`${BASE_URL}/${Products}`).then((res) => res.json()),
        ]);

        setSuppliers(suppliersRes.data || []);
        setProducts(productsRes.data || []);
      } catch {
        toast.error("فشل في تحميل البيانات.");
      }
    };

    fetchData();
  }, []);

  // ========== Update Selected Product ==========
  useEffect(() => {
    const found = products.find((p) => p.id === selectedProductId);
    setSelectedProduct(found || null);
  }, [selectedProductId, products]);

  const handleSubmit = async () => {
    if (!selectedSupplierId || !userId || selectedProducts.length === 0) {
      toast.error("يرجى تحديد جميع الحقول المطلوبة وإضافة صنف واحد على الأقل.");
      return;
    }

    const hasInvalidAmount = selectedProducts.some(
      (product) => product.amount <= 0
    );
    if (hasInvalidAmount) {
      toast.error("يرجى التأكد من أن كمية كل صنف أكبر من صفر.");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/${EznEdafa}`, {
        totalAmount: finalTotal,
        tax: isTaxChecked ? taxx : 0,
        supplierId: selectedSupplierId,
        products: selectedProducts.map((product) => ({
          productId: product.id,
          amount: product.amount,
        })),
        userId,
        isTaxed: isTaxChecked,
      });

      toast.success("تم إرسال إذن الإضافة بنجاح.");
    } catch (error: any) {
      console.error("خطأ عام في إرسال إذن الإضافة:", error);
      toast.error(
        error?.response?.data?.message || "فشل في إرسال إذن الإضافة."
      );
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Invoice-Ezn",
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      @media print {
        .printable-component { position: static; left: auto; top: auto; }
        table { width: 100%; border-collapse: collapse; page-break-inside: auto; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        .no-print { display: none; }
      }
    `,

    onBeforePrint: () => {
      if (!selectedProducts.length || !selectedSupplierId) {
        toast.error("يرجى تحديد مورد ومنتجات قبل الطباعة.");
        return Promise.reject();
      }

      return Promise.resolve(); // لازم ده
    },
  });

  const handleExportExcel = () => {
    toast.info("سيتم تصدير البيانات إلى Excel");
    // يمكنك إضافة منطق تصدير Excel هنا
  };

  const totalAmountBeforeSubmit = selectedProducts.reduce((acc, item) => {
    const amount = Number(item.amount) || 0;
    const price = Number(item.buyPrice) || 0;
    return acc + amount * price;
  }, 0);
  const taxx = isTaxChecked ? totalAmountBeforeSubmit * 0.14 : 0;
  const deduction = totalAmountBeforeSubmit * 0.01;
  const finalTotal = totalAmountBeforeSubmit + taxx - deduction;

  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId);

  return (
    <div dir="rtl">
      <style jsx>{`
        .printable-component {
          position: absolute;
          left: -9999px;
          top: -9999px;
        }
      `}</style>

      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <h1 className="font-semibold text-3xl text-gray-800">إذن إضافة</h1>
        <Button variant="secondary" className="hover:bg-amber-100">
          <IoIosAddCircleOutline className="ml-2" />
          إذن إضافة جديد
        </Button>
      </div>

      <Card className="shadow-md border rounded-xl p-6 space-y-8 w-full max-w-6xl mx-auto bg-white">
        <p className="text-xl font-semibold text-gray-800">
          تعديل كارت الإضافة
        </p>
        <hr />

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          {/* Supplier */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              اختر المورد
            </label>
            <select
              value={selectedSupplierId ?? ""}
              onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="" disabled>
                اختر اسم المورد
              </option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Select */}
          <CardContent className="w-full col-span-1 md:col-span-2">
            <motion.div
              whileHover={{ scale: 1.01 }}
              dir="rtl"
              className="
                  p-6 
                  bg-gradient-to-br 
                  from-green-50 
                  to-blue-50 
                  rounded-xl 
                  shadow-md 
                  hover:shadow-lg 
                  transition-shadow 
                  duration-300
                  min-h-[120px]
                  flex
                  flex-col
                  items-center
                  justify-center
                "
            >
              <Alert
                search={search}
                setSearch={setSearch}
                products={products}
                selectedProductId={selectedProductId}
                setSelectedProductId={setSelectedProductId}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                quantity={quantity}
                setquantity={setquantity}
              />
            </motion.div>
            <div className="w-full col-span-1 md:col-span-2 mt-8">
              <SelectedData
                products={products}
                selectedProductId={selectedProductId}
                selectedProducts={selectedProducts}
                setSelectedProductId={setSelectedProductId}
                setSelectedProducts={setSelectedProducts}
              />
            </div>
          </CardContent>
          <div className="flex flex-col items-center justify-center col-end-2 gap-6">
            {/* قسم الضريبة وخصم المنبع */}
            <div className="space-y-4 w-full max-w-md">
              {/* Checkbox لضريبة القيمة المضافة */}
              <div className="flex items-center gap-3">
                <Checkbox
                  id="tax"
                  checked={isTaxChecked}
                  onCheckedChange={(value) => setIsTaxChecked(!!value)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label
                  htmlFor="tax"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  تطبيق ضريبة 14%
                </Label>
              </div>

              <div className="flex items-center justify-between py-2">
                <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  خصم المنبع (1%):
                </Label>
                <span className="text-sm font-semibold text-red-500 dark:text-red-400">
                  -{deduction.toFixed(2)} ج.م
                </span>
              </div>
            </div>

            {/* قسم الضريبة والإجمالي قبل الخصم */}
            <div className="space-y-4 w-full max-w-md">
              {/* الضريبة */}
              <div className="flex items-center justify-between py-2">
                <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  الضريبة (14%):
                </Label>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                  {taxx.toFixed(2)} ج.م
                </span>
              </div>

              {/* الإجمالي قبل الخصم */}
              <div className="flex items-center justify-between py-2">
                <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  الإجمالي قبل الخصم والضريبة:
                </Label>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                  {totalAmountBeforeSubmit.toFixed(2)} ج.م
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <div className="flex">
          <div className="w-[45%] ms-auto">
            <div className="flex items-center justify-between bg-blue-100 text-gray-800 p-3 rounded-lg h-16">
              <Label className="text-lg font-semibold">الإجمالي النهائي:</Label>
              <span className="text-xl font-bold tracking-wider">
                {finalTotal.toFixed(2)} ج.م
              </span>
            </div>
          </div>
        </div>
        <CardFooter className="flex justify-end gap-4">
          <Button
            variant="outline"
            className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            onClick={handlePrint}
          >
            طباعة إذن الإضافة
          </Button>
          <Button
            variant="outline"
            className="bg-white text-green-600 border-green-600 hover:bg-green-50"
            onClick={handleExportExcel}
          >
            تصدير إلى Excel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => handleSubmit()}
          >
            حفظ الفاتوره
          </Button>
        </CardFooter>
      </Card>

      <div className="printable-component">
        <PrintableComponent
          ref={printRef}
          selectedSupplier={selectedSupplier}
          selectedProducts={selectedProducts}
          totalAmountBeforeSubmit={totalAmountBeforeSubmit}
          taxx={taxx}
          deduction={deduction}
          finalTotal={finalTotal}
          isTaxChecked={isTaxChecked}
        />
      </div>
    </div>
  );
};

export default Page;
