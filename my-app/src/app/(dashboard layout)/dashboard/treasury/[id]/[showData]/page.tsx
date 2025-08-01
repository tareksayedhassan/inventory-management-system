"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";
import {
  BASE_URL,
  Supplier,
  Treasury,
  TreasuryTransaction,
} from "@/apiCaild/API";
import { fetcher } from "@/apiCaild/fetcher";
import axios from "axios";
import Cookie from "cookie-universal";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/Types/CustomJWTDecoded";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import TransactionsTable from "@/components/customUi/TransactionsTable";
import { formSchema } from "@/utils/ValidationSchemas";
import Pagention from "@/components/customUi/pagention";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionType } from "@/utils/ValidationSchemas";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const cookie = Cookie();
  const token = cookie.get("Bearer");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { id } = useParams();

  const { data: transactionData, mutate: mutateTransaction } = useSWR(
    `${BASE_URL}/${TreasuryTransaction}/${id}?page=${currentPage}&pageSize=${rowsPerPage}`,
    fetcher
  );
  const transactions = transactionData?.data || [];

  if (!token) {
    console.error("لم يتم العثور على التوكن");
    return null;
  }

  let decoded: DecodedToken;
  try {
    decoded = jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("JWT decode error:", error);
    return null;
  }

  let userId: number | undefined = undefined;
  if (token) {
    const decoded = jwtDecode<DecodedToken>(token);
    userId = decoded.id;
  }
  const router = useRouter();

  const { data, mutate } = useSWR(`${BASE_URL}/${Treasury}/${id}`, fetcher);
  const treasury = data?.data || {};

  const { data: DataSupplier } = useSWR(`${BASE_URL}/${Supplier}`, fetcher);
  const supplier = DataSupplier?.data || {};

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionType: "Tahseel_mn_3ameel",
      amount: 0,
      date: new Date(),
      method: "cash",
    },
  });

  const transactionType = form.watch("transactionType");
  const method = form.watch("method");
  console.log("method is now:", method);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!id || isNaN(Number(id))) {
      toast.error("رقم الخزنة غير صالح");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${BASE_URL}/${TreasuryTransaction}`,
        {
          type: values.transactionType,
          amount: values.amount,
          reference: values.reference || null,
          createdAt: values.date,
          method: values.method,
          userId,
          treasuryId: Number(id),
          ...(values.transactionType === "Tahseel_mn_3ameel" && {
            clientId: Number(values.partyId),
          }),
          ...(values.transactionType === "Sadad_le_moored" && {
            supplierId: Number(values.partyId),
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("تم تسجيل بيانات العملية بنجاح");

      mutateTransaction();
      form.reset();
      mutate();
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || "حدث خطأ غير متوقع";
      toast.error(errMessage);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (transactionId: string) => {
    try {
      await fetch(`${BASE_URL}/${TreasuryTransaction}/${transactionId}`, {
        method: "DELETE",
      });
      mutateTransaction();
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
    <div className="container mt-4" dir="rtl">
      {/* Header */}
      <div className="w-full bg-white rounded-xl px-6 py-4 flex justify-between items-center shadow-sm border-b-2 border-blue-200">
        <h1 className="text-lg font-semibold text-gray-800">
          سجل حركة خزنة: {treasury.name}
        </h1>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => router.push("/dashboard/treasury")}
        >
          العودة للخزائن
        </Button>
      </div>

      {/* Current Balance */}
      <Card className="mt-4 shadow-2xl border-0 border-b-4 border-blue-200">
        <CardContent>
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-semibold text-gray-800">
              الرصيد الحالي
            </h1>
            <p>{treasury.balance} ج.م</p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Form */}
      <Card className="p-6 mt-3.5 shadow-2xl border-0 border-b-4 border-blue-200">
        <CardHeader>
          <CardTitle className="text-right">تسجيل حركة مالية جديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                {/* Transaction Type */}
                <FormField
                  control={form.control}
                  name="transactionType"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-4 w-full">
                      <FormLabel>نوع الحركة</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-12 text-right">
                            <SelectValue placeholder="اختر نوع الحركة" />
                          </SelectTrigger>
                          <SelectContent className="text-right">
                            <SelectItem value="Tahseel_mn_3ameel">
                              تحصيل من عميل
                            </SelectItem>
                            <SelectItem value="Sadad_le_moored">
                              سداد لمورد
                            </SelectItem>
                            <SelectItem value="Eda3_mobasher">
                              إيداع مباشر
                            </SelectItem>
                            <SelectItem value="Sa7b_mobasher">
                              سحب مباشر
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Party Selection */}
                <AnimatePresence mode="wait">
                  {(transactionType === "Tahseel_mn_3ameel" ||
                    transactionType === "Sadad_le_moored") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="lg:col-span-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="partyId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {transactionType === "Tahseel_mn_3ameel"
                                  ? "العميل"
                                  : "المورد"}
                              </FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="h-12 text-right">
                                    <SelectValue placeholder="اختر..." />
                                  </SelectTrigger>
                                  <SelectContent className="text-right">
                                    {transactionType === "Sadad_le_moored" ? (
                                      supplier.length > 0 ? (
                                        supplier.map((sup: any) => (
                                          <SelectItem
                                            className="cursor-pointer"
                                            key={sup.id}
                                            value={sup.id.toString()}
                                          >
                                            {sup.name}
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem value="" disabled>
                                          لا يوجد موردين
                                        </SelectItem>
                                      )
                                    ) : null}

                                    {transactionType ===
                                      "Tahseel_mn_3ameel" && (
                                      // هنا ممكن تعرض العملاء بنفس الطريقة لو عندك بياناتهم
                                      <>
                                        <SelectItem value="1">
                                          عميل 1
                                        </SelectItem>
                                        <SelectItem value="2">
                                          عميل 2
                                        </SelectItem>
                                      </>
                                    )}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Amount and Date */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المبلغ</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <input
                              type="number"
                              step="any"
                              className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left pl-8 shadow-sm"
                              {...field}
                              onChange={(e) => field.onChange(+e.target.value)}
                            />
                            <span className="absolute left-3 top-3 text-gray-500">
                              $
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>التاريخ</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-12 w-full justify-start text-right font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "yyyy-MM-dd")
                                ) : (
                                  <span>اختر تاريخ</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Payment Method and Reference */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>طريقة الدفع</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="h-12 text-right bg-white border border-gray-300 shadow-sm">
                              <SelectValue placeholder="اختر طريقة الدفع" />
                            </SelectTrigger>
                            <SelectContent className="text-right">
                              <SelectItem value="cash">نقدي</SelectItem>
                              <SelectItem value="check">شيك</SelectItem>
                              <SelectItem value="transfer">تحويل</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <AnimatePresence mode="wait">
                    {(method === "check" || method === "transfer") && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                      >
                        <FormField
                          control={form.control}
                          name="reference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {method === "check"
                                  ? "رقم الشيك"
                                  : "رقم الحوالة"}
                              </FormLabel>
                              <FormControl>
                                <input
                                  type="text"
                                  className="h-12 w-full rounded-md border bg-background px-3 py-2 text-sm"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <div className="lg:col-span-4 flex justify-end ">
                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 px-8 cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? "جارٍ التنفيذ..." : "تنفيذ الحركة"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="w-full">
        <Card className="mt-6">
          <CardContent>
            <div className="text-right mb-6">
              <h1 className="inline-block text-2xl sm:text-3xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 w-full">
                الحركات المسجلة
              </h1>
            </div>

            <div className="w-full overflow-x-hidden">
              <div className="overflow-hidden rounded-lg shadow">
                <Table className="min-w-full divide-y divide-gray-200 text-sm">
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="px-3 py-2 text-center min-w-[90px]">
                        التاريخ
                      </TableHead>
                      <TableHead className="px-3 py-2 text-center min-w-[120px]">
                        البيان
                      </TableHead>
                      <TableHead className="px-3 py-2 text-center min-w-[70px]">
                        المبلغ
                      </TableHead>
                      <TableHead className="px-3 py-2 text-center min-w-[70px] hidden sm:table-cell">
                        الطريقة
                      </TableHead>
                      <TableHead className="px-3 py-2 text-center min-w-[120px] hidden md:table-cell">
                        مرجع (رقم شيك/حوالة)
                      </TableHead>
                      <TableHead className="px-3 py-2 text-center min-w-[100px] hidden md:table-cell">
                        نوع الحركة
                      </TableHead>
                      <TableHead className="px-3 py-2 text-center min-w-[90px] hidden lg:table-cell">
                        المستخدم
                      </TableHead>
                      <TableHead className="px-3 py-2 text-center min-w-[110px]">
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
                        <TableCell className="px-3 py-2 text-center">
                          {new Date(tra.createdAt).toLocaleDateString("ar-EG")}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-center">
                          {tra.description || "--"}
                        </TableCell>
                        <TableCell
                          className={`px-3 py-2 text-center font-medium ${
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
                        <TableCell className="px-3 py-2 text-center hidden sm:table-cell">
                          {tra.method === "cash"
                            ? "كاش"
                            : tra.method === "bank"
                            ? "بنك"
                            : tra.method || "--"}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-center hidden md:table-cell">
                          {tra.reference || "--"}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-center hidden md:table-cell">
                          {typeLabels[tra.type as TransactionType] ||
                            "غير معروف"}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-center hidden lg:table-cell">
                          {tra.user?.name || "غير معروف"}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-center">
                          <div className="flex justify-center items-center gap-2 flex-wrap">
                            <Button
                              variant="secondary"
                              className="bg-red-300 px-3 py-1 text-sm"
                              onClick={() => deleteRecord(tra.id)}
                            >
                              الحذف
                            </Button>
                            <Button
                              variant="secondary"
                              className="bg-yellow-100 px-3 py-1 text-sm"
                            >
                              التعديل
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6">
                <Pagention
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  rowsPerPage={rowsPerPage}
                  totalItems={transactionData?.totalItems || 0}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
