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
interface DataProps {
  id: number;
}
const ProductMovement = ({ id }: DataProps) => {
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

  const product = data?.data || [];
  return (
    <div className="space-y-6 mt-5" dir="rtl">
      <Card className="border dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold border-b border-blue-200 text-start pb-2 mb-4 pr-3.5">
            تقرير حركه صنف{" "}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-hidden">
            <div className="overflow-hidden rounded-lg shadow">
              <Table className="min-w-full divide-y divide-gray-300 text-sm text-gray-700">
                <TableHeader className="bg-gray-100 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="px-4 py-3 text-center min-w-[120px]">
                      التسلسل
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center min-w-[110px]">
                      المخزن{" "}
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center min-w-[90px] hidden sm:table-cell">
                      نوع الحركه{" "}
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center min-w-[130px] hidden md:table-cell">
                      كود المنتج{" "}
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center min-w-[100px]">
                      المورد{" "}
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center min-w-[130px]">
                      الكميه{" "}
                    </TableHead>{" "}
                    <TableHead className="px-4 py-3 text-center min-w-[130px]">
                      السعر الكلي{" "}
                    </TableHead>{" "}
                    <TableHead className="px-4 py-3 text-center min-w-[130px]">
                      سعر القطعه{" "}
                    </TableHead>{" "}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {/* {supplier.map((tra: any, index: number) => (
                    <TableRow
                      key={`${tra.id}-${index}`}
                      className="hover:bg-gray-50 transition"
                    >
                      <TableCell className="px-4 py-2 text-center">
                        {tra.name || "--"}
                      </TableCell>

                      <TableCell className="px-4 py-2 text-center">
                        {tra.phone || "--"}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-center hidden sm:table-cell">
                        {tra.balance || "--"}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-2 text-center hidden md:table-cell font-medium`}
                      >
                        {tra.status === SupplierStatus.creditBalance ? (
                          <Badge className="bg-green-500 text-white">له</Badge>
                        ) : tra.status === SupplierStatus.debitBalance ? (
                          <Badge className="bg-red-500 text-white">عليه</Badge>
                        ) : tra.status === SupplierStatus.neutral ? (
                          <Badge className="bg-blue-400 text-white">
                            صافي حساب
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-500 text-white">معلق</Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-center">
                        {format(
                          toZonedTime(tra.createdAt, "Africa/Cairo"),
                          "dd/MM/yyyy hh:mm a"
                        )}
                      </TableCell>

                      <TableCell className="px-4 py-2 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs cursor-pointer "
                            onClick={() => showSuppiler(tra.id)}
                          >
                            كشف حساب
                          </Button>

                          <Button
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs"
                            onClick={() => {
                              setSelectedSupplier(tra);
                              setIsDialogOpen(true);
                            }}
                          >
                            تفاصيل
                          </Button>
                          <button
                            onClick={() => DeleteRecord(tra.id)}
                            className="text-red-600 hover:text-red-800  cursor-pointer font-extrabold text-4xl"
                            title="حذف المورد"
                          >
                            <MdDeleteForever />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))} */}
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
