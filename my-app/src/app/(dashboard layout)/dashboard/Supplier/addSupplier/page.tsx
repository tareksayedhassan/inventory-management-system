"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";
import axios from "axios";
import Cookie from "cookie-universal";
import { BASE_URL, Supplier } from "@/apiCaild/API";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { DecodedToken } from "@/Types/CustomJWTDecoded";

const AddCompany = () => {
  const router = useRouter();
  const cookie = Cookie();
  const token = cookie.get("Bearer");

  let userId: number | undefined = undefined;
  if (token) {
    const decoded = jwtDecode<DecodedToken>(token);
    userId = decoded.id;
  }

  const [status, setStatus] = useState("");
  const [generalAlert, setGeneralAlert] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [Name, setName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      if (photoFile) {
        formData.append("file", photoFile);
      }

      formData.append("status", status);
      formData.append("general_alert", generalAlert);
      formData.append("address", address);
      formData.append("phone", phone);
      formData.append("name", Name);
      formData.append("added_by_id", String(userId));
      formData.append("updated_by_id", String(userId));

      const res = await axios.post(`${BASE_URL}/${Supplier}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        toast.success("Supplier added sucssuflly");
        router.push("/dashboard/Supplier");
      } else {
        toast.error("error added Supplier ");
      }
    } catch (error: any) {
      toast.error(`error: ${error?.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 max-w-xl mx-auto">
      <div>
        <Label htmlFor="status">الحالة</Label>
        <Select onValueChange={(val) => setStatus(val)}>
          <SelectTrigger>
            <SelectValue placeholder="اختر الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
            <SelectItem value="INACTIVE">INACTIVE</SelectItem>
            <SelectItem value="PENDING">PENDING</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>اسم المورد </Label>
        <Input value={Name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <Label>الإشعار العام</Label>
        <Textarea
          value={generalAlert}
          onChange={(e) => setGeneralAlert(e.target.value)}
        />
      </div>

      <div>
        <Label>العنوان</Label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <div>
        <Label>رقم الهاتف</Label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div>
        <Label>شعار الشركة</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) setPhotoFile(e.target.files[0]);
          }}
        />
        {photoFile && (
          <Image
            src={URL.createObjectURL(photoFile)}
            alt="preview"
            width={80}
            height={80}
            className="mt-2 rounded"
          />
        )}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "جاري الإضافة..." : "إضافة الشركة"}
      </Button>
    </form>
  );
};

export default AddCompany;
