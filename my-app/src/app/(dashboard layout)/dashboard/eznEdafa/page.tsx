"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  BASE_URL,
  EznEdafa,
  Products,
  Supplier as SupplierEndpoint,
  Treasury,
} from "@/apiCaild/API";
import { DecodedToken } from "@/Types/CustomJWTDecoded";
import { IoIosAddCircleOutline } from "react-icons/io";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import Cookie from "cookie-universal";
import axios from "axios";
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
// ========== Types ==========
type Supplier = { id: number; name: string };
type Product = {
  id: number;
  name: string;
  code: string;
  unit: string;
  buyPrice: number;
};

// ========== Main Component ==========
const Page = () => {
  const [amount, setAmount] = useState(1);
  const [tax, setTax] = useState(14);

  const [treasuries, setTreasuries] = useState<Supplier[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    (Product & { amount: number; buyPrice: number })[]
  >([]);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTreasuryId, setSelectedTreasuryId] = useState<number | null>(
    null
  );
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(
    null
  );
  const [userId, setUserId] = useState<number | null>(null);

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

  // ========== Fetch Data ==========
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, treasuriesRes, productsRes] = await Promise.all([
          fetch(`${BASE_URL}/${SupplierEndpoint}`).then((res) => res.json()),
          fetch(`${BASE_URL}/${Treasury}`).then((res) => res.json()),
          fetch(`${BASE_URL}/${Products}`).then((res) => res.json()),
        ]);

        setSuppliers(suppliersRes.data || []);
        setTreasuries(treasuriesRes.data || []);
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

  // ========== Submit ==========
  const handleSubmit = async () => {
    if (
      !selectedProductId ||
      !selectedSupplierId ||
      !selectedTreasuryId ||
      !userId
    ) {
      toast.error("يرجى تحديد جميع الحقول المطلوبة.");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/${EznEdafa}`, {
        amount,
        tax,
        supplierId: selectedSupplierId,
        productId: selectedProductId,
        treasuryId: selectedTreasuryId,
        userId,
      });
      console.log(res);
      toast.success("تم إرسال إذن الإضافة بنجاح.");
    } catch (err) {
      toast.error("فشل في إرسال إذن الإضافة.");
      console.error("Error:", err);
    }
  };
  const totalAmountBeforeSubmit = selectedProducts.reduce((acc, item) => {
    const amount = Number(item.amount) || 0;
    const price = Number(item.buyPrice) || 0;
    return acc + amount * price;
  }, 0);
  const taxx = totalAmountBeforeSubmit * 0.14;
  const deduction = totalAmountBeforeSubmit * 0.01;
  const finalTotal = totalAmountBeforeSubmit + taxx - deduction;
  // ========== Render ==========
  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen">
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

          {/* Treasury */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              اختر الخزينة
            </label>
            <select
              value={selectedTreasuryId ?? ""}
              onChange={(e) => setSelectedTreasuryId(Number(e.target.value))}
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="" disabled>
                اختر اسم الخزينة
              </option>
              {treasuries.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Discount & Tax */}
          <div className="flex gap-4 items-center">
            <div className="flex flex-col">
              <label className="font-medium text-gray-700 mb-1">
                نسبة الخصم (%)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-[100px] border rounded p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700 mb-1">
                نسبة الضريبة (%)
              </label>
              <input
                type="number"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
                className="w-[100px] border rounded p-2"
              />
            </div>
          </div>

          {/* Product Select */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              اختر الصنف
            </label>
            <select
              value={selectedProductId ?? ""}
              onChange={(e) => setSelectedProductId(Number(e.target.value))}
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="" disabled>
                -- اختر الصنف --
              </option>
              {products.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Info */}
          {selectedProduct && (
            <>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  كود الصنف
                </label>
                <input
                  type="text"
                  value={selectedProduct.code}
                  readOnly
                  className="w-full border rounded p-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  اسم الصنف
                </label>
                <input
                  type="text"
                  value={selectedProduct.name}
                  readOnly
                  className="w-full border rounded p-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  الوحدة
                </label>
                <input
                  type="text"
                  value={selectedProduct.unit}
                  readOnly
                  className="w-full border rounded p-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  تكلفة الشراء
                </label>
                <input
                  type="number"
                  value={selectedProduct.buyPrice}
                  readOnly
                  className="w-full border rounded p-2 bg-gray-100"
                />
              </div>
            </>
          )}
          <div className="col-span-1 md:col-span-2">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                if (!selectedProduct) return toast.error("اختر صنف أولاً");

                setSelectedProducts([
                  ...selectedProducts,
                  {
                    ...selectedProduct,
                    amount: 1,
                    buyPrice: selectedProduct.buyPrice || 0,
                  },
                ]);
              }}
            >
              إضافة الصنف
            </Button>
          </div>

          <div className="col-span-1 md:col-span-2 overflow-x-auto">
            <Table className="w-full border text-center">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="min-w-[100px] text-center">
                    كود الصنف
                  </TableHead>
                  <TableHead className="min-w-[150px] text-center">
                    اسم الصنف
                  </TableHead>
                  <TableHead className="min-w-[100px] text-center">
                    الكمية
                  </TableHead>
                  <TableHead className="min-w-[120px] text-center">
                    تكلفة الواحدة
                  </TableHead>
                  <TableHead className="min-w-[120px] text-center">
                    الإجمالي بالجنيه
                  </TableHead>
                  <TableHead className="min-w-[100px] text-center">
                    إجراءات
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {selectedProducts.map((product, index) => {
                  const total = product.amount * product.buyPrice;

                  return (
                    <TableRow
                      key={`${product.id}-${index}`}
                      className="hover:bg-gray-50 align-middle"
                    >
                      <TableCell className="align-middle text-center">
                        {product.code}
                      </TableCell>
                      <TableCell className="align-middle text-center">
                        {product.name}
                      </TableCell>
                      <TableCell className="align-middle text-center">
                        {product.amount}
                      </TableCell>
                      <TableCell className="align-middle text-center">
                        {product.buyPrice.toFixed(2)} ج.م
                      </TableCell>
                      <TableCell className="align-middle text-center font-medium text-green-700">
                        {total.toFixed(2)} ج.م
                      </TableCell>
                      <TableCell className="align-middle">
                        <Button
                          variant="destructive"
                          className="text-sm px-3 py-1 cursor-pointer"
                          onClick={() => {
                            setSelectedProducts(
                              selectedProducts.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          حذف
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="w-full max-w-2xl bg-gray-50 border border-gray-300 rounded-lg shadow-sm p-6 space-y-4 text-gray-800">
            <div className="flex justify-between">
              <span className="font-medium">الإجمالي قبل الخصم والضريبة:</span>
              <span>{totalAmountBeforeSubmit.toFixed(2)} ج.م</span>
            </div>

            <hr className="border-gray-300" />

            <div className="flex justify-between">
              <span className="font-medium">الضريبة (14%):</span>
              <span>{taxx.toFixed(2)} ج.م</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">خصم المنبع (1%):</span>
              <span>{deduction.toFixed(2)} ج.م</span>
            </div>

            <hr className="border-gray-300" />

            <div className="flex justify-between text-green-700 font-semibold text-lg">
              <span>الإجمالي النهائي للكارت:</span>
              <span>{finalTotal.toFixed(2)} ج.م</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            حفظ الإضافة
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
