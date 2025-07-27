"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
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
import useSWR from "swr";
import Loading from "@/components/customUi/loading";
import { fetcher } from "@/apiCaild/fetcher";
import Pagention from "@/components/customUi/pagention";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [name, setName] = useState("");
  const [Price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [note, setNote] = useState("");
  const [productCode, setproductCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const cookie = Cookie();
  const token = cookie.get("Bearer");

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

  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/${Products}?page=${currentPage}&pageSize=${rowsPerPage}&search=${search}`,
    fetcher
  );

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  const product = data?.data || [];
  const totalPrice = data?.totalPrice || 0;
  const totalItems = data?.total || 0;

  const DeleteRecord = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/${Products}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      mutate();
      toast.info("product deleted successfully");
    } catch (error) {
      toast.error("Faild to delete product");
    }
  };

  // const editCompany = (id: number) => {
  //   router.push(`/dashboard/treasury/${id}`);
  // };

  const setData = async () => {
    if (!userId) {
      toast.error("Invalid User Id");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", Price);
    formData.append("stock", stock);
    formData.append("note", note);
    formData.append("productCode", productCode);

    formData.append("added_by_id", userId.toString());
    formData.append("updated_by_id", userId.toString());

    try {
      const res = await axios.post(`${BASE_URL}/${Products}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        toast.success("تمت إضافة الصنف بنجاح");
        mutate();
        setName("");
        setPrice("");
        setStock("");
        setNote("");
        setproductCode("");
      } else {
        toast.error("حدث خطأ أثناء الإضافة");
      }
    } catch (error: any) {
      toast.error(`خطأ: ${error?.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div dir="rtl" className="p-6 bg-gray-50 min-h-screen">
        <Card className="shadow-md border rounded-xl p-4 sm:p-6 space-y-8 w-full max-w-6xl mx-auto bg-white">
          <div className="text-right">
            <h1 className="inline-block text-2xl sm:text-3xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 w-full">
              إضافة وتعديل الأصناف
            </h1>
          </div>
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b-2 border-b-gray-200 pb-2 inline-block">
              إضافة صنف جديد
            </h2>
          </div>
          <CardContent className="grid grid-cols-1 gap-6 text-sm text-gray-700">
            <div className="p-0 sm:p-4">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px] sm:min-w-[220px] max-w-full sm:max-w-[350px]">
                    <Label className="mb-1 block text-sm font-medium text-gray-700">
                      اسم الصنف
                    </Label>
                    <Input
                      className="w-full"
                      placeholder="أدخل اسم الصنف"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="flex-1 min-w-[200px] sm:min-w-[220px] max-w-full sm:max-w-[350px]">
                    <Label className="mb-1 block text-sm font-medium text-gray-700">
                      كود الصنف (SKU)
                    </Label>
                    <Input
                      className="w-full"
                      value={productCode}
                      onChange={(e) => setproductCode(e.target.value)}
                    />
                  </div>

                  <div className="flex-1 min-w-[200px] sm:min-w-[220px] max-w-full sm:max-w-[350px]">
                    <Label className="mb-1 block text-sm font-medium text-gray-700">
                      سعر البيع الافتراضي
                    </Label>
                    <Input
                      className="w-full"
                      placeholder="مثلاً: 150"
                      type="number"
                      value={Price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[200px] sm:min-w-[220px] max-w-full sm:max-w-[350px]">
                    <Label className="mb-1 block text-sm font-medium text-gray-700">
                      الكمية
                    </Label>
                    <Input
                      className="w-full"
                      placeholder="مثلاً: 10"
                      value={stock}
                      type="number"
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>

                  <div className="flex-1 min-w-[200px] sm:min-w-[220px] max-w-full sm:max-w-[350px]">
                    <Label className="mb-1 block text-sm font-medium text-gray-700">
                      ملاحظات
                    </Label>
                    <Input
                      className="w-full"
                      placeholder="مثلاً: المنتج جديد أو به خصم"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>

                  <div className="w-full sm:w-auto">
                    <Button
                      onClick={() => setData()}
                      disabled={loading}
                      className="w-full  cursor-pointer text-white font-semibold px-6 py-2 rounded-md shadow-md transition"
                    >
                      {loading ? "جاري الإضافة..." : "➕ أضف الصنف"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <hr />

            <div className="bg-white p-0 sm:p-6 rounded-xl w-full text-right">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
                📥 استيراد من Excel
              </h2>
              <span className="text-sm text-gray-600 block mb-4 max-w-full">
                قم بتحميل ملف Excel بصيغة
                <code className="bg-transparent sm:bg-gray-100 text-gray-800 px-1 rounded">
                  .xlsx
                </code>
                ويحتوي على الأعمدة:
                <span className="block sm:hidden">
                  <code className="bg-transparent text-gray-800 px-1 rounded block mt-1">
                    name
                  </code>
                  <code className="bg-transparent text-gray-800 px-1 rounded block mt-1">
                    stock
                  </code>
                  <code className="bg-transparent text-gray-800 px-1 rounded block mt-1">
                    note
                  </code>
                  <code className="bg-transparent text-gray-800 px-1 rounded block mt-1">
                    productCode
                  </code>
                  <code className="bg-transparent text-gray-800 px-1 rounded block mt-1">
                    price
                  </code>
                </span>
                <span className="hidden sm:inline">
                  <code className="bg-transparent sm:bg-gray-100 text-gray-800 px-1 rounded">
                    name
                  </code>
                  ،
                  <code className="bg-transparent sm:bg-gray-100 text-gray-800 px-1 rounded">
                    stock
                  </code>
                  ،
                  <code className="bg-transparent sm:bg-gray-100 text-gray-800 px-1 rounded">
                    note
                  </code>
                  ،
                  <code className="bg-transparent sm:bg-gray-100 text-gray-800 px-1 rounded">
                    productCode
                  </code>
                  ،
                  <code className="bg-transparent sm:bg-gray-100 text-gray-800 px-1 rounded">
                    price
                  </code>
                </span>
              </span>
              <div className="border-2 border-gray-300 rounded-lg p-4 sm:p-6 text-right hover:border-gray-700 transition w-full overflow-x-auto">
                <input
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  id="excel-upload"
                />
                <label
                  htmlFor="excel-upload"
                  className="cursor-pointer text-blue-600 font-medium hover:underline"
                >
                  📁 اختر ملف Excel من جهازك
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  فقط ملفات .xlsx مدعومة
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardContent>
            <div className="text-right mb-10">
              <h1 className="inline-block text-3xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 w-full">
                إضافة وتعديل الأصناف
              </h1>
            </div>
            <div className="col-span-1 md:col-span-2 overflow-x-auto">
              <Table className="w-full border text-center">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="min-w-[150px] text-center">
                      الاسم
                    </TableHead>
                    <TableHead className="min-w-[100px] text-center">
                      الكود
                    </TableHead>
                    <TableHead className="min-w-[80px] text-center">
                      الكمية
                    </TableHead>
                    <TableHead className="min-w-[150px] text-center">
                      الملاحظات
                    </TableHead>
                    <TableHead className="min-w-[150px] text-center">
                      اجمالي السعر
                    </TableHead>
                    <TableHead className="min-w-[150px] text-center">
                      اجراءات حذف وتعديل
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {product.map((pro: any, index: number) => (
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
                </TableBody>

                <TableFooter>
                  <TableRow className="bg-gray-100 font-bold">
                    <TableCell colSpan={5} className="text-start">
                      الإجمالي
                    </TableCell>
                    <TableCell className="text-center text-blue-600">
                      {totalPrice} ج.م
                    </TableCell>
                  </TableRow>
                </TableFooter>
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
    </div>
  );
};

export default Page;
