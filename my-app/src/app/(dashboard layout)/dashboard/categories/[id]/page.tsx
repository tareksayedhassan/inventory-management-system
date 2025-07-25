"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Cookie from "cookie-universal";
import { BASE_URL, Categories } from "@/apiCaild/API";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { DecodedToken } from "@/Types/CustomJWTDecoded";
import useSWR from "swr";
import { fetcher } from "@/apiCaild/fetcher";
import Loading from "@/components/customUi/loading";

const EditCategory = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const { id } = useParams();

  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/${Categories}/${id}`,
    fetcher
  );
  const category = data?.data || {};

  useEffect(() => {
    if (category?.name) {
      setName(category.name);
    }
  }, [category]);

  const userId = useMemo(() => {
    try {
      if (!token) return undefined;
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.id;
    } catch {
      return undefined;
    }
  }, [token]);

  if (isLoading) return <Loading />;
  if (error || !category) return <div>Error loading category data.</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);

    try {
      const response = await fetch(`${BASE_URL}/${Categories}/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) throw new Error("Error Updated Category");

      mutate();
      toast.success("Category Updated Successfully");
      router.push("/dashboard/categories");
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
          {loading ? "جاري الحفظ..." : "تحديث القسم"}
        </Button>
      </form>
    </div>
  );
};

export default EditCategory;
