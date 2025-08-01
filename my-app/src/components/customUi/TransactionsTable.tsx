"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";
import { BASE_URL, TreasuryTransaction } from "@/apiCaild/API";
import { fetcher } from "@/apiCaild/fetcher";
import { Card, CardContent } from "@/components/ui/card";
import Pagention from "@/components/customUi/pagention";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { TransactionType } from "@/utils/ValidationSchemas";

type TransactionsTableProps = {
  triggerParentMutate?: () => void;
  setMutateTransaction?: (mutate: () => void) => void; // New prop to pass mutateTransaction to parent
};

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  triggerParentMutate,
  setMutateTransaction,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { id } = useParams();

  const { data: transactionData, mutate: mutateTransaction } = useSWR(
    `${BASE_URL}/${TreasuryTransaction}/${id}?page=${currentPage}&pageSize=${rowsPerPage}`,
    fetcher
  );
  const transactions = transactionData?.data || [];
  // Pass mutateTransaction to parent via setMutateTransaction
  React.useEffect(() => {
    if (setMutateTransaction) {
      setMutateTransaction(mutateTransaction);
    }
  }, [mutateTransaction, setMutateTransaction]);

  const deleteRecord = async (transactionId: string) => {
    try {
      await fetch(`${BASE_URL}/${TreasuryTransaction}/${transactionId}`, {
        method: "DELETE",
      });
      await mutateTransaction(); // Update child data
      if (triggerParentMutate) {
        triggerParentMutate(); // Trigger parent mutate
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };
  const typeLabels: Record<TransactionType, string> = {
    Tahseel_mn_3ameel: "تحصيل من عميل",
    Sadad_le_moored: "سداد لمورد",
    Eda3_mobasher: "إيداع مباشر",
    Sa7b_mobasher: "سحب مباشر",
  };

  return (
    <div>
      <Card className="mt-6">
        <CardContent>
          <div className="text-right mb-10">
            <h1 className="inline-block text-3xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 w-full">
              الحركات المسجلة
            </h1>
          </div>
          <div className="overflow-x-auto">
            <Table className="w-full border text-center">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="min-w-[150px] text-center">
                    التاريخ
                  </TableHead>
                  <TableHead className="min-w-[150px] text-center">
                    البيان
                  </TableHead>
                  <TableHead className="min-w-[100px] text-center">
                    المبلغ
                  </TableHead>
                  <TableHead className="min-w-[100px] text-center">
                    الطريقة
                  </TableHead>
                  <TableHead className="min-w-[100px] text-center">
                    مرجع
                  </TableHead>
                  <TableHead className="min-w-[150px] text-center">
                    نوع الحركة
                  </TableHead>
                  <TableHead className="min-w-[120px] text-center">
                    المستخدم
                  </TableHead>
                  <TableHead className="min-w-[150px] text-center">
                    إجراء
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tra: any, index: number) => (
                  <TableRow
                    key={`${tra.id}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="text-center">
                      {new Date(tra.createdAt).toLocaleDateString("ar-EG")}
                    </TableCell>

                    <TableCell className="text-center">
                      {tra.description || "--"}
                    </TableCell>

                    <TableCell
                      className={`text-center font-medium ${
                        ["Eda3_mobasher", "Tahseel_mn_3ameel"].includes(
                          tra.type
                        )
                          ? "text-green-700"
                          : ["Sa7b_mobasher", "Sadad_le_moored"].includes(
                              tra.type
                            )
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {tra.amount} ج.م
                    </TableCell>

                    <TableCell className="text-center">
                      {tra.method === "cash"
                        ? "كاش"
                        : tra.method === "bank"
                        ? "بنك"
                        : tra.method || "--"}
                    </TableCell>

                    <TableCell className="text-center">
                      {tra.reference || "--"}
                    </TableCell>

                    <TableCell className="text-center">
                      {typeLabels[tra.type as TransactionType] || "غير معروف"}
                    </TableCell>

                    <TableCell className="text-center">
                      {tra.user?.name || "غير معروف"}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          variant="secondary"
                          className="bg-red-300 px-2 py-1 text-sm"
                          onClick={() => deleteRecord(tra.id)}
                        >
                          الحذف
                        </Button>
                        <Button
                          variant="secondary"
                          className="bg-yellow-100 px-2 py-1 text-sm"
                        >
                          التعديل
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagention
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              rowsPerPage={rowsPerPage}
              totalItems={transactionData?.totalItems || 0}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsTable;
