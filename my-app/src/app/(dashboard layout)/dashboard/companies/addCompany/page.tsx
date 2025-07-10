"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Compny } from "@/Types/company";
import { toast } from "sonner";
import Image from "next/image";
import axios from "axios";
import Cookie from "cookie-universal";
import { BASE_URL, Company } from "@/apiCaild/API";
import { jwtDecode, JwtPayload } from "jwt-decode";
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Compny>();

  const onSubmit = async (data: Compny) => {
    try {
      const formData = new FormData();
      const photoFile = (data.photo as unknown as FileList)?.[0];

      if (photoFile) {
        formData.append("file", photoFile);
      }

      formData.append("status", data.status);
      formData.append("general_alert", data.general_alert);
      formData.append("address", data.address);
      formData.append("phone", data.phone);
      formData.append("company_code", data.company_code);
      formData.append("added_by_id", userId!.toString());
      formData.append("updated_by_id", userId!.toString());

      const res = await axios.post(`${BASE_URL}/${Company}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        toast.success("Company created successfully");
        router.push("/dashboard/companies");
      } else {
        toast.error("Failed to create company");
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const selectedFile = watch("photo") as unknown as FileList;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-4 max-w-xl mx-auto"
    >
      <div>
        <Label htmlFor="status">الحالة</Label>
        <Select onValueChange={(value) => setValue("status", value as any)}>
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
        <Label htmlFor="general_alert">الإشعار العام</Label>
        <Textarea id="general_alert" {...register("general_alert")} />
      </div>

      <div>
        <Label htmlFor="address">العنوان</Label>
        <Input id="address" {...register("address")} />
      </div>

      <div>
        <Label htmlFor="phone">رقم الهاتف</Label>
        <Input id="phone" {...register("phone")} />
      </div>

      <div>
        <Label htmlFor="company_code">كود الشركة</Label>
        <Input id="company_code" {...register("company_code")} />
      </div>

      <div>
        <Label htmlFor="photo">شعار الشركة</Label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          {...register("photo")}
          className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
        />
        {selectedFile?.[0] && (
          <Image
            src={URL.createObjectURL(selectedFile[0])}
            alt="preview"
            width={80}
            height={80}
            className="mt-2 rounded"
          />
        )}
      </div>

      <Button type="submit">إضافة الشركة</Button>
    </form>
  );
};

export default AddCompany;
