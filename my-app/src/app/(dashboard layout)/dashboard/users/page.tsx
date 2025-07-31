"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BASE_URL, USERS } from "../../../../apiCaild/API";
import useSWR from "swr";
import { fetcher } from "@/apiCaild/fetcher";
import Loading from "@/components/customUi/loading";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/Types/CustomJWTDecoded";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { registerClient } from "@/utils/ValidationSchemas";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import Pagention from "@/components/customUi/pagention";
import { useRouter } from "next/navigation";

const UsersPage = () => {
  const [role, setUserRole] = useState("USER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const router = useRouter();
  const cookie = Cookie();
  const token = cookie.get("Bearer");

  if (!token) {
    toast.error("invild token");
    return null;
  }

  let decoded: DecodedToken;
  try {
    decoded = jwtDecode<DecodedToken>(token);
  } catch (err) {
    toast.error("invild token");

    return null;
  }

  const currentUserId = decoded.id;

  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/${USERS}?page=${currentPage}&pageSize=${rowsPerPage}`,
    fetcher
  );
  const totalItems = data?.total || 0;
  const users = data?.data || [];

  const handleSubmit = async () => {
    const validate = registerClient.safeParse({
      name,
      password,
      email,
      confirmPassword: password,
      role,
    });

    if (!validate.success) {
      const err = validate.error.issues[0].message;
      return toast.error(err);
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/${USERS}`, {
        name,
        email,
        password,
        role,
      });
      if (res.status == 400) {
        toast.error("Email already exists");
      }
      toast.success("تم إنشاء المستخدم بنجاح");
      mutate();
      setName("");
      setEmail("");
      setPassword("");
      setUserRole("USER");
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || "حدث خطأ غير متوقع";
      toast.error(errMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("الصفحة الحالية:", currentPage);
    console.log("البيانات:", users);
  }, [currentPage, users]);

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="text-center text-red-500 py-4">
        حدث خطأ أثناء تحميل البيانات
      </div>
    );

  return (
    <>
      <div dir="rtl" className="p-4 space-y-6 max-w-6xl mx-auto min-h-screen">
        <Card className="shadow-md border-none rounded-lg">
          <CardContent className="p-4">
            <div className="text-right mb-4 border-b pb-3">
              <h1 className="text-2xl font-bold text-gray-900">
                إدارة المستخدمين
              </h1>
            </div>

            <Table className="w-full text-center border border-gray-200 rounded-md">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 py-2">
                    الاسم
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-2">
                    الإيميل
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-2">
                    الدور
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-2">
                    إجراء
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((tra: any, index: number) => (
                  <TableRow
                    key={`${tra.id}-${index}`}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    <TableCell className="py-2">{tra.name}</TableCell>
                    <TableCell className="py-2 text-ellipsis overflow-hidden whitespace-nowrap max-w-xs">
                      {tra.email || "--"}
                    </TableCell>
                    <TableCell className="py-2">{tra.role || "--"}</TableCell>
                    <TableCell className="py-2">
                      {tra.id !== currentUserId ? (
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="secondary"
                            className="bg-red-100 text-red-700 text-sm hover:bg-red-200 transition-colors"
                            size="sm"
                          >
                            الحذف
                          </Button>
                          <Button
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-700 text-sm hover:bg-yellow-200 transition-colors"
                            size="sm"
                          >
                            التعديل
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          مستخدم حالي
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-3">
              <Pagention
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
                totalItems={totalItems}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-none rounded-lg">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              إضافة مستخدم جديد
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 text-sm">اسم المستخدم</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-700 text-sm">
                  البريد الإلكتروني
                </Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-700 text-sm">كلمة المرور</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-700 text-sm">الدور</Label>
                <select
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                  value={role}
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <option value="ADMIN">أدمن</option>
                  <option value="USER">مستخدم</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm transition-colors cursor-pointer"
              >
                {loading ? "جارٍ الإرسال..." : "إضافة المستخدم"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UsersPage;
