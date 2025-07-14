"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSWR from "swr";
import { BASE_URL, Treasury } from "@/apiCaild/API";
import { fetcher } from "@/apiCaild/fetcher";
import axios from "axios";
import Cookie from "cookie-universal";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositDesc, setDepositDesc] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawDesc, setWithdrawDesc] = useState("");
  const [returnAmount, setReturnAmount] = useState(0);
  const [returnDesc, setReturnDesc] = useState("");

  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [loadingReturn, setLoadingReturn] = useState(false);

  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const { id } = useParams();

  const { data } = useSWR(`${BASE_URL}/${Treasury}/${id}`, fetcher);
  const treasury = data?.data || {};

  const handleDeposit = async () => {
    if (loadingDeposit) return;
    setLoadingDeposit(true);
    try {
      await axios.post(
        `${BASE_URL}/Treasury/${id}/deposit`,
        { amount: depositAmount, description: depositDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("تم الإيداع بنجاح");
      setDepositAmount(0);
      setDepositDesc("");
    } catch {
      toast.error("فشل في عملية الإيداع");
    } finally {
      setLoadingDeposit(false);
    }
  };

  const handleWithdraw = async () => {
    if (loadingWithdraw) return;
    setLoadingWithdraw(true);
    try {
      await axios.post(
        `${BASE_URL}/Treasury/${id}/withdraw`,
        { amount: withdrawAmount, description: withdrawDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("تم السحب بنجاح");
      setWithdrawAmount(0);
      setWithdrawDesc("");
    } catch {
      toast.error("فشل في عملية السحب");
    } finally {
      setLoadingWithdraw(false);
    }
  };

  const handleReturn = async () => {
    if (loadingReturn) return;
    setLoadingReturn(true);
    try {
      await axios.post(
        `${BASE_URL}/Treasury/${id}/return`,
        { amount: returnAmount, description: returnDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("تم المرتجع بنجاح");
      setReturnAmount(0);
      setReturnDesc("");
    } catch {
      toast.error("فشل في عملية المرتجع");
    } finally {
      setLoadingReturn(false);
    }
  };

  return (
    <div className="container mx-auto mt-10" dir="rtl">
      <div className="bg-gray-100 p-6 rounded shadow mb-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">بيانات الخزنة</h2>
        <p>
          <strong>الاسم:</strong> {treasury.name || "جارٍ التحميل..."}
        </p>
        <p>
          <strong>الرصيد:</strong> {treasury.balance ?? "جارٍ التحميل..."}
        </p>
        <p>
          <strong>الوصف:</strong> {treasury.description || "جارٍ التحميل..."}
        </p>
      </div>

      <Tabs defaultValue="deposit" className="w-full max-w-xl mx-auto">
        <TabsList className="flex justify-end gap-2 mb-4">
          <TabsTrigger value="deposit">إيداع</TabsTrigger>
          <TabsTrigger value="withdraw">سحب</TabsTrigger>
          <TabsTrigger value="return">مرتجع</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleDeposit();
            }}
            className="bg-white p-6 rounded shadow space-y-4"
          >
            <h3 className="text-lg font-semibold">عملية إيداع</h3>
            <div>
              <Label>المبلغ</Label>
              <Input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <Label>الوصف</Label>
              <Input
                value={depositDesc}
                onChange={(e) => setDepositDesc(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loadingDeposit} className="w-full">
              {loadingDeposit ? "جارٍ الإيداع..." : "تنفيذ الإيداع"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="withdraw">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleWithdraw();
            }}
            className="bg-white p-6 rounded shadow space-y-4"
          >
            <h3 className="text-lg font-semibold">عملية سحب</h3>
            <div>
              <Label>المبلغ</Label>
              <Input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <Label>الوصف</Label>
              <Input
                value={withdrawDesc}
                onChange={(e) => setWithdrawDesc(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loadingWithdraw} className="w-full">
              {loadingWithdraw ? "جارٍ السحب..." : "تنفيذ السحب"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="return">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleReturn();
            }}
            className="bg-white p-6 rounded shadow space-y-4"
          >
            <h3 className="text-lg font-semibold">عملية مرتجع</h3>
            <div>
              <Label>المبلغ</Label>
              <Input
                type="number"
                value={returnAmount}
                onChange={(e) => setReturnAmount(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <Label>الوصف</Label>
              <Input
                value={returnDesc}
                onChange={(e) => setReturnDesc(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loadingReturn} className="w-full">
              {loadingReturn ? "جارٍ التنفيذ..." : "تنفيذ المرتجع"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
