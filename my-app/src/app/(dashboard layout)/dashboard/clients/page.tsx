"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useSWR from "swr";
import { BASE_URL, clients, Supplier } from "@/apiCaild/API";
import { fetcher } from "@/apiCaild/fetcher";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Cookie from "cookie-universal";
import Pagention from "@/components/customUi/pagention";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loading from "@/components/customUi/loading";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MdDeleteForever } from "react-icons/md";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientSchema } from "@/utils/ValidationSchemas";
import SupplierDialog from "@/components/customUi/SupplierDialog";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/Types/CustomJWTDecoded";
import { SupplierStatus } from "@prisma/client";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("");
  const [Campname, setCampname] = useState("");
  const [note, setnote] = useState("");
  const [address, setaddress] = useState("");
  const [tax_number, settax_number] = useState("");
  const [phone, setphone] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const cookie = Cookie();
  const router = useRouter();
  const token = cookie.get("Bearer");
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
  const decoded = jwtDecode<DecodedToken>(token);
  const userName = decoded.name;
  const { data, isLoading, mutate } = useSWR(
    `${BASE_URL}/${clients}?page=${currentPage}&pageSize=${rowsPerPage}&search=${search}`,
    fetcher
  );

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  const supplier = data?.data || [];
  const totalItems = data?.total || 0;

  const DeleteRecord = async (id: number) => {
    const conf = confirm("هل انت متاكد من حذف هذا العميل ؟");
    if (!conf) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/${clients}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      mutate();
      toast.info("Supplier deleted successfully");
    } catch (error) {
      toast.error("Failed to delete Supplier");
    }
  };

  const handilSubmit = async () => {
    const validation = ClientSchema.safeParse({
      Campname,
      name,
      tax_number,
      added_by_id: userId,
      address,
      phone,
      note,
    });
    if (!validation.success) {
      const err = validation.error.issues[0].message;
      return toast.error(err);
    }
    try {
      await axios.post(
        `${BASE_URL}/${clients}`,
        {
          name,
          Campname,
          tax_number,
          added_by_id: userId,
          address,
          phone,
          note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("تم اضافه العميل بنجاح");
      mutate();
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || "حدث خطأ غير متوقع";
      toast.error(errMessage);
    }
  };
  const showSuppiler = (id: number) => {
    return router.push(`/dashboard/Supplier/${id}/addOpertion`);
  };
  return (
    <div dir="rtl" className="p-4">
      <Card>
        <CardTitle className="text-2xl font-semibold border-b border-blue-200 text-start pb-2 mb-4 pr-3.5">
          حسابات العملاء
        </CardTitle>

        <CardContent>
          <div className="w-full overflow-x-hidden">
            <div className="overflow-hidden rounded-lg shadow">
              <Table className="min-w-full divide-y divide-gray-300 text-sm text-gray-700">
                <TableHeader className="bg-gray-100 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="px-4 py-3 text-center min-w-[120px]">
                      الاسم
                    </TableHead>

                    <TableHead className="px-4 py-3 text-center min-w-[110px]">
                      رقم الهاتف
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center min-w-[90px] hidden sm:table-cell">
                      الرصيد
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center min-w-[130px] hidden md:table-cell">
                      الحالة
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center min-w-[100px]">
                      التاريخ
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center min-w-[130px]">
                      اجراء{" "}
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {supplier.map((tra: any, index: number) => (
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
                  ))}
                </TableBody>
              </Table>
              {selectedSupplier && (
                <SupplierDialog
                  addedByName={userName}
                  name={selectedSupplier.name}
                  Campname={selectedSupplier.Campname}
                  phone={selectedSupplier.phone}
                  address={selectedSupplier.address}
                  tax_number={selectedSupplier.tax_number}
                  balance={selectedSupplier.balance?.toString() || "0"}
                  note={selectedSupplier.note}
                  status={selectedSupplier.status}
                  createdAt={new Date(selectedSupplier.createdAt)}
                  added_by_id={selectedSupplier.added_by_id}
                  isOpen={isDialogOpen}
                  onClose={() => setIsDialogOpen(false)}
                />
              )}

              <Pagention
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
                totalItems={totalItems}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardTitle className="text-2xl font-semibold border-b border-blue-200 text-start pb-2 mb-4 pr-3.5">
          اضافه مورد جديد{" "}
        </CardTitle>
        <CardContent>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                الاسم
              </Label>
              <Input
                id="name"
                placeholder="ادخل الاسم"
                className="text-right"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                رقم الهاتف
              </Label>
              <Input
                id="phone"
                placeholder="ادخل رقم الهاتف"
                className="text-right"
                value={phone}
                onChange={(e) => setphone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="company"
                className="text-sm font-medium text-gray-700"
              >
                اسم الشركة
              </Label>
              <Input
                id="company"
                placeholder="ادخل اسم الشركة"
                className="text-right"
                value={Campname}
                onChange={(e) => setCampname(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="company"
                className="text-sm font-medium text-gray-700"
              >
                العنوان{" "}
              </Label>
              <Input
                id="company"
                placeholder="ادخل العنوان"
                className="text-right"
                value={address}
                onChange={(e) => setaddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="taxNumber"
                className="text-sm font-medium text-gray-700"
              >
                الرقم الضريبي
              </Label>
              <Input
                id="taxNumber"
                placeholder="ادخل الرقم الضريبي"
                className="text-right"
                value={tax_number}
                onChange={(e) => settax_number(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="note"
                className="text-sm font-medium text-gray-700"
              >
                ملاحظات
              </Label>
              <Input
                id="note"
                placeholder="ادخل الملاحظات"
                className="text-right"
                value={note}
                onChange={(e) => setnote(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center w-full mt-4 gap-4">
              {/* السيليكت في أقصى اليسار */}
              <div className="space-y-2 flex-1">
                <Label
                  htmlFor="type"
                  className="text-sm font-medium text-gray-700"
                >
                  النوع
                </Label>
                <Select>
                  <SelectTrigger className="text-right w-full">
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier">مورد</SelectItem>
                    <SelectItem value="both">مورد وعميل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* الزر في أقصى اليمين */}
              <div className="flex-1 flex justify-end">
                <Button onClick={handilSubmit} className="whitespace-nowrap">
                  اضف العميل
                </Button>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
