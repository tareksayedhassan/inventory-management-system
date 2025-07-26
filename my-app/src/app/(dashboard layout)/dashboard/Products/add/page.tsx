"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Cookie from "cookie-universal";
import { BASE_URL, Products, Treasury } from "@/apiCaild/API";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { DecodedToken } from "@/Types/CustomJWTDecoded";

interface ICategory {
  id: number;
  name: string;
}

interface ITreasury {
  id: number;
  name: string;
}

const AddProduct = () => {
  const router = useRouter();
  const cookie = Cookie();
  const token = cookie.get("Bearer");

  const [name, setName] = useState("");
  const [Price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      if (typeof decoded.id === "number") {
        setUserId(decoded.id);
      } else {
        toast.error("User ID is invalid.");
      }
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Invild User Id");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("unit", unit);
    formData.append("Price", Price);
    formData.append("sellPrice", sellPrice);
    formData.append("stock", stock);
    formData.append("minStock", minStock);
    formData.append("note", note);
    formData.append("added_by_id", userId.toString());
    formData.append("updated_by_id", userId.toString());
    formData.append("categoryId", Number(categoryId).toString());
    formData.append("treasuryId", Number(treasuryId).toString());

    try {
      const res = await axios.post(`${BASE_URL}/${Products}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        toast.success("Added products Successufly");
        router.push("/dashboard/Products");
      } else {
        toast.error("حدث خطأ أثناء الإضافة");
      }
    } catch (error: any) {
      toast.error(`خطأ: ${error?.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 p-4 max-w-xl mx-auto overflow-y-hidden">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>اسم المنتج</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>الوحدة</Label>
          <Input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>سعر الشراء</Label>
            <Input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>سعر البيع</Label>
            <Input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>الحد الأدنى</Label>
            <Input
              type="number"
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
            />
          </div>
          <div>
            <Label>الكميه المضافه الى الخزنه</Label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>القسم</Label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">اختر قسم</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>الخزنة</Label>
          <select
            value={treasuryId}
            onChange={(e) => setTreasuryId(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">اختر خزنة</option>
            {treasuries.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>ملاحظات</Label>
          <Input value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "جاري الحفظ..." : "إضافة المنتج"}
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
