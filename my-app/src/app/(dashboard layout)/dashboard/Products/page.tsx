"use client";
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
import useSWR from "swr";
import { BASE_URL, Products } from "@/apiCaild/API";
import { fetcher } from "@/apiCaild/fetcher";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Cookie from "cookie-universal";
import Pagention from "@/components/customUi/pagention";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loading from "@/components/customUi/loading";
interface IProduct {
  id: number;
  code: string;
  name: string;
  category?: { id: number; name: string };
  unit: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  added_by?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  updated_by_id: number;
}

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const [searchQuery, setSearchQuery] = useState("");
  // improve search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);
  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/${Products}?page=${currentPage}&pageSize=${rowsPerPage}&search=${searchQuery}`,
    fetcher
  );
  if (isLoading) return <div>{<Loading />}</div>;
  const Product: IProduct[] = data?.data || [];
  console.log(Product);
  const router = useRouter();
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const DeleteProduct = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/${Products}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      mutate();
      toast.info("company deleted successfully");
    } catch (error) {
      toast.error("Faild to delete Company");
    }
  };

  const editProduct = (id: number) => {
    router.push(`/dashboard/products/${id}`);
  };

  return (
    <div dir="rtl" className="p-4">
      <div className="hidden xl:block overflow-x-auto w-full">
        <Table className="border rounded-lg min-w-[1050px]">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[40px] text-center font-bold text-gray-800">
                #
              </TableHead>

              <TableHead className="w-[120px] font-bold text-gray-800">
                الاسم
              </TableHead>
              <TableHead className="w-[100px] font-bold text-gray-800">
                الفئة
              </TableHead>
              <TableHead className="w-[70px] font-bold text-gray-800">
                الوحدة
              </TableHead>
              <TableHead className="w-[90px] font-bold text-gray-800">
                س.الشراء
              </TableHead>
              <TableHead className="w-[90px] font-bold text-gray-800">
                س.البيع
              </TableHead>
              <TableHead className="w-[80px] font-bold text-gray-800">
                الحد الأدنى
              </TableHead>
              <TableHead className="w-[70px] font-bold text-gray-800">
                الكميه المضافه الى الخزنه
              </TableHead>
              <TableHead className="w-[130px] font-bold text-gray-800">
                ملاحظات
              </TableHead>
              <TableHead className="w-[110px] font-bold text-gray-800">
                إضافة
              </TableHead>
              <TableHead className="w-[110px] font-bold text-gray-800">
                تحديث
              </TableHead>
              <TableHead className="w-[100px] font-bold text-gray-800">
                أضيف بـ
              </TableHead>
              <TableHead className="w-[100px] font-bold text-gray-800">
                تم التحديث بـ
              </TableHead>
              <TableHead className="w-[110px] font-bold text-gray-800">
                تحكم
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Product.map((item, index) => (
              <TableRow key={item.code} className="hover:bg-gray-50">
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell
                  className="max-w-[140px] truncate"
                  title={item.category?.name}
                >
                  {item.category?.name}
                </TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.buyPrice}</TableCell>
                <TableCell>{item.sellPrice}</TableCell>
                <TableCell className="truncate max-w-[10px] whitespace-nowrap overflow-hidden">
                  {item.minStock}
                </TableCell>
                <TableCell
                  className="truncate max-w-[150px] whitespace-nowrap overflow-hidden
"
                >
                  {item.stock}
                </TableCell>
                <TableCell
                  title={item.note}
                  className="truncate max-w-[70px] whitespace-nowrap overflow-hidden
"
                >
                  {item.note || "—"}
                </TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(item.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell
                  className="max-w-[140px] truncate"
                  title={item.added_by?.name}
                >
                  <p>{item.added_by?.name || "غير معروف"}</p>
                  <p className="text-gray-500 text-sm">
                    {item.added_by?.role || ""}
                  </p>
                </TableCell>{" "}
                <TableCell>{item.updated_by_id}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      className="px-2 py-1 text-sm"
                      onClick={() => DeleteProduct(item.id)}
                    >
                      حذف
                    </Button>
                    <Button
                      variant="secondary"
                      className="bg-yellow-100 text-black px-2 py-1 text-sm"
                      onClick={() => editProduct(item.id)}
                    >
                      تعديل
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableCaption className="mt-4 font-semibold text-lg text-gray-500">
            قائمة المنتجات المُسجلة
          </TableCaption>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="xl:hidden grid gap-4 p-4">
        {Product.map((item, key) => (
          <Card
            key={key}
            className="shadow-md border border-gray-200 rounded-2xl p-4 space-y-4 w-full"
          >
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base font-bold text-gray-800">
                  {item.name}
                </CardTitle>
              </div>
            </div>

            <CardContent className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-700">
              <div>
                <span className="font-semibold text-gray-600">الفئة:</span>
                <div>{item.category?.name}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">الوحدة:</span>
                <div>{item.unit}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">سعر الشراء:</span>
                <div>{item.buyPrice}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">سعر البيع:</span>
                <div>{item.sellPrice}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">الرصيد:</span>
                <div>{item.stock}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  الحد الأدنى:
                </span>
                <div>{item.minStock}</div>
              </div>
              {item.note && (
                <div className="col-span-2">
                  <span className="font-semibold text-gray-600">ملاحظات:</span>
                  <div>{item.note}</div>
                </div>
              )}
              <div>
                <span className="font-semibold text-gray-600">
                  تاريخ الإضافة:
                </span>
                <div>{new Date(item.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  تاريخ التحديث:
                </span>
                <div>{new Date(item.updatedAt).toLocaleDateString()}</div>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-gray-600">
                  أضيف بواسطة:
                </span>

                <p>{item.added_by?.name || "غير معروف"}</p>
                <p className="text-gray-500 text-sm">
                  {item.added_by?.role || ""}
                </p>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-gray-600">
                  تم التحديث بواسطة:
                </span>
                <div>{item.updated_by_id}</div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center flex-wrap gap-3 pt-2">
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => DeleteProduct(item.id)}
                >
                  الحذف
                </Button>
                <Button
                  variant="secondary"
                  className="bg-yellow-100 text-black flex-1"
                  onClick={() => editProduct(item.id)}
                >
                  التعديل
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="xl:hidden">
        <Pagention
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
};

export default Page;
