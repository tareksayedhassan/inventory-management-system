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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  const [isTaxChecked, setIsTaxChecked] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState<
    (Product & { amount: number; buyPrice: number })[]
  >([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [search, setSearch] = useState("");
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
        tax: isTaxChecked ? 14 : 0,
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
    treasuryWithdrow();
  };

  const treasuryWithdrow = async () => {
    if (!selectedTreasuryId) {
      toast.error("برجاء اختيار خزينه لاتمام العمليه");
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/${Treasury}/${selectedTreasuryId}/withdraw`,
        {
          amount: finalTotal,
        }
      );
      toast.success("تم تنفيذ عملية السحب من الخزينة بنجاح.");
    } catch (error) {
      toast.error("فشل في تنفيذ السحب من الخزينة.");
      console.error(error);
    }
  };

  const totalAmountBeforeSubmit = selectedProducts.reduce((acc, item) => {
    const amount = Number(item.amount) || 0;
    const price = Number(item.buyPrice) || 0;
    return acc + amount * price;
  }, 0);
  const taxx = isTaxChecked ? totalAmountBeforeSubmit * 0.14 : 0;
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

          {/* Product Select */}
          <CardContent className="w-full col-span-1 md:col-span-2">
            <div
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="
                      bg-green-600 
                      text-white 
                      hover:bg-green-700 
                      transition-colors 
                      duration-200 
                      rounded-lg 
                      px-8 
                      py-3 
                      flex 
                      items-center 
                      gap-2 
                      font-semibold
                      shadow-md
                      hover:shadow-lg
                    "
                  >
                    إضافة صنف <FaSearch />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent
                  className="
                    w-[95vw] 
                    max-w-[90vw] 
                    h-[70vh] 
                    bg-white 
                    rounded-2xl 
                    shadow-xl 
                    p-8 
                    border 
                    border-gray-100 
                    transition-all 
                    duration-300 
                    ease-in-out
                    flex 
                    flex-col
                    bg-gradient-to-br 
                    from-gray-50 
                    to-green-50
                  "
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold text-gray-800 mb-4 text-center">
                      اختيار الأصناف
                    </AlertDialogTitle>
                    <div className="w-full max-w-lg mx-auto mb-6">
                      <Input
                        type="search"
                        placeholder="ابحث باسم الصنف..."
                        className="
                          rounded-lg 
                          border 
                          border-gray-200 
                          px-4 
                          py-3 
                          w-full 
                          focus:ring-2 
                          focus:ring-green-400 
                          focus:outline-none 
                          text-gray-700
                          transition-all 
                          duration-200
                          bg-white
                          shadow-sm
                          hover:shadow-md
                        "
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </AlertDialogHeader>

                  <AlertDialogDescription className="flex-1 overflow-auto">
                    <div className="w-full">
                      <Table className="w-full text-center border border-gray-100 rounded-lg bg-white shadow-sm">
                        <TableHeader>
                          <TableRow className="bg-gray-50 text-gray-700 font-semibold">
                            <TableHead className="w-1/4 text-center border py-3">
                              تكلفة الشراء
                            </TableHead>
                            <TableHead className="w-1/4 text-center border py-3">
                              الكمية
                            </TableHead>
                            <TableHead className="w-2/4 text-center border py-3">
                              اسم الصنف
                            </TableHead>
                            <TableHead className="w-1/4 text-center border py-3">
                              كود الصنف
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products
                            .filter((item) =>
                              item.name
                                .toLowerCase()
                                .includes(search.toLowerCase())
                            )
                            .map((item, key) => (
                              <TableRow
                                key={key}
                                className="
                                  hover:bg-green-100 
                                  transition-colors 
                                  duration-200 
                                  cursor-pointer
                                "
                                onClick={() => setSelectedProductId(item.id)}
                              >
                                <TableCell className="text-center border py-3">
                                  {item.buyPrice.toFixed(2)} ج.م
                                </TableCell>
                                <TableCell className="text-center border py-3">
                                  {item.unit}
                                </TableCell>
                                <TableCell className="text-center border py-3">
                                  {item.name}
                                </TableCell>
                                <TableCell className="text-center border py-3">
                                  {item.code}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </AlertDialogDescription>

                  <AlertDialogFooter className="mt-6 flex justify-end gap-4">
                    <AlertDialogCancel
                      className="
                        bg-gray-200 
                        text-gray-700 
                        hover:bg-gray-300 
                        transition-colors 
                        duration-200 
                        rounded-lg 
                        px-6 
                        py-2
                        shadow-md
                        hover:shadow-lg
                      "
                    >
                      إلغاء
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="
                        bg-green-600 
                        text-white 
                        hover:bg-green-700 
                        transition-colors 
                        duration-200 
                        rounded-lg 
                        px-6 
                        py-2
                        shadow-md
                        hover:shadow-lg
                      "
                      onClick={() => {
                        if (selectedProductId) {
                          const product = products.find(
                            (p) => p.id === selectedProductId
                          );
                          if (product) {
                            setSelectedProducts([
                              ...selectedProducts,
                              {
                                ...product,
                                amount: 1,
                                buyPrice: product.buyPrice,
                              },
                            ]);
                            toast.success("تم إضافة الصنف بنجاح.");
                          }
                        }
                      }}
                    >
                      متابعة
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>

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
          <div className="col-span-1 md:col-span-2"></div>

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
          <div className="w-full max-w-2xl bg-gray-50 border border-gray-300 rounded-2xl shadow-md p-6 text-gray-800 space-y-6">
            {/* Checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="tax"
                checked={isTaxChecked}
                onCheckedChange={(value) => setIsTaxChecked(!!value)}
              />
              <Label
                htmlFor="tax"
                className="text-sm font-medium text-gray-700"
              >
                تطبيق ضريبة 14%
              </Label>
            </div>
            <hr />

            {/* Summary Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="font-medium text-gray-700">
                الإجمالي قبل الخصم والضريبة:
              </div>
              <div className="text-right">
                {totalAmountBeforeSubmit.toFixed(2)} ج.م
              </div>

              <div className="font-medium text-gray-700">الضريبة (14%) :</div>
              <div className="text-right">{taxx.toFixed(2)} ج.م</div>

              <div className="font-medium text-gray-700">خصم المنبع (1%) :</div>
              <div className="text-right">{deduction.toFixed(2)} ج.م</div>
            </div>

            <hr className="border-gray-300" />

            {/* Final Total */}
            <div className="flex justify-between items-center text-green-700 font-semibold text-base">
              <span>الإجمالي النهائي للكارت:</span>
              <span>{finalTotal.toFixed(2)} ج.م</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => handleSubmit()}
          >
            حفظ الفاتوره
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
