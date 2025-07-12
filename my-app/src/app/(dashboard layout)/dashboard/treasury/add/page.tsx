"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import Cookie from "cookie-universal";
import { BASE_URL, Treasury } from "@/apiCaild/API";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { DecodedToken } from "@/Types/CustomJWTDecoded";

const AddTreasury = () => {
  const router = useRouter();
  const cookie = Cookie();
  const token = cookie.get("Bearer");

  let userId: number | undefined = undefined;
  if (token) {
    const decoded = jwtDecode<DecodedToken>(token);
    userId = decoded.id;
  }

  const [Name, setName] = useState("");
  const [last_exchange_receipt_number, setLastExchange] = useState("");
  const [last_collect_receipt_number, setLastCollect] = useState("");
  const [is_master, setIsMaster] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", Name);
      formData.append(
        "last_exchange_receipt_number",
        last_exchange_receipt_number
      );
      formData.append(
        "last_collect_receipt_number",
        last_collect_receipt_number
      );
      formData.append("is_master", String(is_master));
      formData.append("added_by_id", String(userId));
      formData.append("updated_by_id", String(userId));

      const res = await axios.post(`${BASE_URL}/${Treasury}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        toast.success("Treasury added successfully");
        router.push("/dashboard/treasury");
      } else {
        toast.error("error adedd Teasury");
      }
    } catch (error: any) {
      toast.error(`خطأ: ${error?.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-30 ">
      <form onSubmit={handleSubmit} className="space-y-6 p-4 max-w-xl mx-auto">
        <div>
          <Label>اسم الخزينة</Label>
          <Input
            value={Name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ادخل اسم الخزينة"
            className="hover:font-bold hover:bg-amber-100"
          />
        </div>

        <div>
          <Label>رقم آخر إيصال صرف</Label>
          <Input
            type="number"
            value={last_exchange_receipt_number}
            onChange={(e) => setLastExchange(e.target.value)}
            placeholder="exmple:1001"
          />
        </div>

        <div>
          <Label>رقم آخر إيصال قبض</Label>
          <Input
            type="number"
            value={last_collect_receipt_number}
            onChange={(e) => setLastCollect(e.target.value)}
            placeholder="exmple:2001"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_master"
            checked={is_master}
            onCheckedChange={(val: boolean) => setIsMaster(val)}
          />
          <Label htmlFor="is_master">خزينة رئيسية؟</Label>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "جاري الإضافة..." : "إضافة الخزينة"}
        </Button>
      </form>
    </div>
  );
};

export default AddTreasury;
