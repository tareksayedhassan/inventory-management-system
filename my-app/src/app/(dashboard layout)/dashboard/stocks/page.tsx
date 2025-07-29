"use client";
import { BASE_URL, stock } from "@/apiCaild/API";
import { fetcher } from "@/apiCaild/fetcher";
import React, { useState } from "react";
import useSWR from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagention from "@/components/customUi/pagention";
import { Card, CardContent } from "@/components/ui/card";
const page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/${stock}?page=${currentPage}&pageSize=${rowsPerPage}&search=${search}`,
    fetcher
  );

  const product = data?.data || [];
  const totalPrice = data?.totalPrice || 0;
  const totalItems = data?.total || 0;

  return (
    <div className="col-span-1 md:col-span-2 mt-7" dir="rtl">
      <Card>
        <CardContent>
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
                <TableHead className="min-w-[80px] text-center">
                  مخزون (بضريبة)
                </TableHead>
                <TableHead className="min-w-[80px] text-center">
                  مخزون (بدون ضريبة)
                </TableHead>

                <TableHead className="min-w-[150px] text-center">
                  إجمالي المخزون
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
                  <TableCell className="text-center">
                    {pro.stockNotTax}
                  </TableCell>
                  <TableCell className="text-center">{pro.stockTax}</TableCell>
                  <TableCell className="text-center font-medium text-green-700">
                    {pro.totalStock}
                  </TableCell>
                  <TableCell className="text-center">
                    {" "}
                    {/* ممكن زر تعديل أو حذف */}{" "}
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
                  {(totalPrice?._sum?.price ?? 0).toLocaleString()} ج.م
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
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
