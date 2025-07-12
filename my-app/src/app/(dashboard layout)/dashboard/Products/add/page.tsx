"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Cookie from "cookie-universal";
import { BASE_URL, Products } from "@/apiCaild/API";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { DecodedToken } from "@/Types/CustomJWTDecoded";

interface ICategory {
  id: number;
  name: string;
}

const AddProduct = () => {
  const router = useRouter();
  const cookie = Cookie();
  const token = cookie.get("Bearer");

  let userId: number | undefined = undefined;
  if (token) {
    const decoded = jwtDecode<DecodedToken>(token);
    userId = decoded.id;
  }

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [minStock, setMinStock] = useState("");
  const [stock, setStock] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data.data);
      } catch (error) {
        toast.error("فشل تحميل الأقسام");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/${Products}`,
        {
          code,
          name,
          unit,
          buyPrice: parseFloat(buyPrice),
          sellPrice: parseFloat(sellPrice),
          stock: parseInt(stock),
          minStock: parseInt(minStock),
          note,
          categoryId: parseInt(categoryId),
          added_by_id: userId,
          updated_by_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        toast.success("تمت إضافة المنتج بنجاح");
        router.push("/dashboard/products");
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
          <Label>كود المنتج</Label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

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
            <Label>الرصيد</Label>
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
