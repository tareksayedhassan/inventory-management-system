"use client";
import React, { useState } from "react";
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
import { BASE_URL, Company } from "@/apiCaild/API";
import { fetcher } from "@/apiCaild/fetcher";
import { Compny } from "@/Types/company";
import Image from "next/image";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/${Company}?page=${currentPage}&pageSize=${rowsPerPage}&search=${search}`,
    fetcher
  );
  const company: Compny[] = data?.data || [];

  return (
    <div dir="rtl" className="p-4">
      <Table className="border  rounded-lg overflow-hidden">
        <TableCaption className="mb-4 font-semibold text-lg text-gray-700">
          قائمة الشركات
        </TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-[100px] font-bold text-gray-800">
              رقم النظام
            </TableHead>
            <TableHead className="font-bold text-gray-800">الصوره</TableHead>
            <TableHead className="font-bold text-gray-800">الحاله</TableHead>
            <TableHead className="text-right font-bold text-gray-800">
              رقم الشركه
            </TableHead>
            <TableHead className="text-right font-bold text-gray-800">
              عنوان الشركه
            </TableHead>
            <TableHead className="text-right font-bold text-gray-800">
              تاريخ الانشاء
            </TableHead>
            <TableHead className="text-right font-bold text-gray-800">
              تاريخ التحديث
            </TableHead>
            <TableHead className="text-right font-bold text-gray-800">
              اضيف بواسطه
            </TableHead>
            <TableHead className="text-right font-bold text-gray-800">
              تم التحديث بواسطه
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {company.map((item, key) => (
            <TableRow
              key={key}
              className="hover:bg-gray-50 transition duration-200 mr-3.5"
            >
              <TableCell className="font-medium">{item.company_code}</TableCell>
              <TableCell className="font-medium">
                <div className="w-12 h-12 rounded-full overflow-hidden border">
                  <Image
                    src={`/uploads/${item.photo || "default.jpg"}`}
                    alt="logo"
                    height={48}
                    width={48}
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.phone}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {item.address}
              </TableCell>
              <TableCell>
                {new Date(item.createdAt.toString()).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(item.updatedAt.toString()).toLocaleDateString()}
              </TableCell>
              <TableCell>{item.added_by_id}</TableCell>
              <TableCell>{item.updated_by_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
