"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import useSWR from "swr";
import { BASE_URL, productTransaction } from "@/apiCaild/API";
import { fetcher } from "@/apiCaild/fetcher";
import Loading from "../customUi/loading";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";
import Cookie from "cookie-universal";
import { toast } from "sonner";
import Link from "next/link";

interface DataProps {
  id: string;
}
const ProductMovement = ({ id }: DataProps) => {
  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/${productTransaction}/${id}`,
    fetcher
  );

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  const product = data?.data
    ? Array.isArray(data.data)
      ? data.data
      : [data.data]
    : [];
  console.log(product);

  const DeleteRecord = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/${productTransaction}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      mutate();
      toast.info("تم حذف حركه المنتج بنجاح");
    } catch (error) {
      toast.error("فشل في حذف حركه المنتج");
    }
  };

  return (
    <div className="space-y-6 mt-5" dir="rtl">
      <Card className="border dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold border-b border-blue-200 text-start pb-2 mb-4 pr-3.5">
            تقرير حركه صنف
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <div className="overflow-hidden rounded-lg shadow">
              <Table className="w-full table-fixed divide-y divide-gray-300 text-sm text-gray-700">
                <TableHeader className="bg-gray-100 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="px-2 py-3 text-center">
                      التسلسل
                    </TableHead>
                    <TableHead className="px-2 py-3 text-center">
                      اسم المنتج
                    </TableHead>
                    <TableHead className="px-2 py-3 text-center">
                      المخزن
                    </TableHead>
                    <TableHead className="px-2 py-3 text-center hidden sm:table-cell">
                      نوع الحركه
                    </TableHead>
                    <TableHead className="px-2 py-3 text-center">
                      كود المنتج
                    </TableHead>
                    <TableHead className="px-2 py-3 text-center">
                      المورد
                    </TableHead>
                    <TableHead className="px-2 py-3 text-center">
                      الكميه
                    </TableHead>
                    <TableHead className="px-2 py-3 text-center">
                      سعر القطعه
                    </TableHead>
                    <TableHead className="px-2 py-3 text-center">
                      السعر الكلي
                    </TableHead>
                    <TableHead className="px-2 py-3 text-center">
                      إجراءات
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {product.map((tra: any, index: number) => (
                    <TableRow
                      key={`${tra.id}-${index}`}
                      className="hover:bg-gray-50 transition"
                    >
                      <TableCell className="px-2 py-2 text-center">
                        {tra.id}
                      </TableCell>
                      <TableCell className="px-2 py-2 text-center">
                        {tra.name}
                      </TableCell>
                      <TableCell className="px-2 py-2 text-center">
                        {tra.Stock ? (
                          <span>مخزن بضريبه</span>
                        ) : tra.StockWithoutTax ? (
                          <span>مخزن بدون ضريبه</span>
                        ) : (
                          <span>لا يوجد مخزون</span>
                        )}
                      </TableCell>
                      <TableCell className="px-2 py-2 text-center hidden sm:table-cell">
                        <Link href={tra.redirctURL || "#"}>
                          <span className="text-blue-600 hover:underline">
                            {tra.type || "--"}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className="px-2 py-2 text-center">
                        {tra.productCode}
                      </TableCell>
                      <TableCell className="px-2 py-2 text-center">
                        {tra.supplier.name}
                      </TableCell>
                      <TableCell className="px-2 py-2 text-center">
                        {tra.quantity}
                      </TableCell>
                      <TableCell className="px-2 py-2 text-center">
                        {tra.price}
                      </TableCell>
                      <TableCell className="px-2 py-2 text-center">
                        {tra.total}
                      </TableCell>
                      <TableCell className="px-2 py-2 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Button className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs">
                            تعديل
                          </Button>
                          <button
                            onClick={() => DeleteRecord(tra.id)}
                            className="text-red-600 hover:text-red-800 cursor-pointer font-extrabold text-4xl"
                            title="حذف المورد"
                          >
                            <MdDeleteForever />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductMovement;
