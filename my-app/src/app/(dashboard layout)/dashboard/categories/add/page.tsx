"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Cookie from "cookie-universal";
import { BASE_URL, Categories, Products } from "@/apiCaild/API";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { DecodedToken } from "@/Types/CustomJWTDecoded";

interface ICategory {
  id: number;
  name: string;
}

const AddCategory = () => {
  const router = useRouter();
  const cookie = Cookie();
  const token = cookie.get("Bearer");

  let userId: number | undefined = undefined;
  if (token) {
    const decoded = jwtDecode<DecodedToken>(token);
    userId = decoded.id;
  }

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    try {
      const res = await axios.post(`${BASE_URL}/${Categories}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        toast.success("Added category successfully");
        router.push("/dashboard/categories");
      } else {
        toast.error("error added Category");
      }
    } catch (error: any) {
      toast.error(`Error: ${error?.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 overflow-y-hidden">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full max-w-xl bg-white p-6 rounded-xl shadow-md"
      >
        <div>
          <Label className="block mb-2 text-right">اسم القسم</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "جاري الحفظ..." : "إضافة المنتج"}
        </Button>
      </form>
    </div>
  );
};

export default AddCategory;
