"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
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
  const total = product.reduce(
    (acc: number, item: any) => acc + Number(item.price || 0),
    0
  );

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
        <Card className="shadow-md border rounded-xl p-6 space-y-8 w-full max-w-6xl mx-auto bg-white">
          <div className="text-right mb-10">
            <h1 className="inline-block text-3xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 w-full">
              إضافة وتعديل الأصناف
            </h1>
          </div>

          <CardContent className="md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div className="p-6">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-right border-b-2 border-b-gray-200 inline-block">
                إضافة صنف جديد
              </h1>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[220px] max-w-[350px]">
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

                  <div className="flex-1 min-w-[220px] max-w-[350px]">
                    <Label className="mb-1 block text-sm font-medium text-gray-700">
                      كود الصنف (SKU)
                    </Label>
                    <Input
                      className="w-full"
                      value={productCode}
                      onChange={(e) => setproductCode(e.target.value)}
                    />
                  </div>

                  <div className="flex-1 min-w-[220px] max-w-[350px]">
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

                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[220px] max-w-[350px]">
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

                  <div className="flex-1 min-w-[220px] max-w-[350px]">
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
                  <Button onClick={() => setData()} disabled={loading}>
                    {loading ? "جاري الإضافة..." : "اضف الصنف"}
                  </Button>
                </div>
              </div>
            </div>
            <hr />
            <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl w-full text-right">
              <h1 className="text-xl font-semibold mb-2 text-gray-800">
                استيراد من Excel
              </h1>
              <span className="text-sm text-gray-600 block mb-4">
                قم بتحميل ملف Excel بصيغة
                <code className="bg-gray-100 text-gray-800 px-1 rounded">
                  .xlsx
                </code>
                ويحتوي على الأعمدة:
                <br />
                <code className="bg-gray-100 text-gray-800 px-1 rounded">
                  name
                </code>
                ,
                <code className="bg-gray-100 text-gray-800 px-1 rounded">
                  stock
                </code>
                ,
                <code className="bg-gray-100 text-gray-800 px-1 rounded">
                  note
                </code>
                ,
                <code className="bg-gray-100 text-gray-800 px-1 rounded">
                  productCode
                </code>
                ,
                <code className="bg-gray-100 text-gray-800 px-1 rounded">
                  price
                </code>
              </span>

              <div className="border-2 border-gray-300 rounded-lg p-6 text-right hover:border-gray-700 transition w-full">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">الاسم</TableHead>
                  <TableHead>الكود</TableHead>
                  <TableHead> الكمية</TableHead>
                  <TableHead className="text-right">الملاحظات</TableHead>
                  <TableHead className="text-right">اجمالي السعر</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.map((pro: any) => (
                  <TableRow key={pro.name}>
                    <TableCell className="font-medium">{pro.name}</TableCell>
                    <TableCell>{pro.productCode}</TableCell>
                    <TableCell>{pro.stock}</TableCell>
                    <TableCell>{pro.note}</TableCell>
                    <TableCell className="text-right">{pro.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>الإجمالي</TableCell>
                  <TableCell className="text-right">{total} جنيه</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
