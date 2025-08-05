"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
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
import useSWR from "swr";
import { fetcher } from "@/apiCaild/fetcher";
import { BASE_URL, Supplier } from "@/apiCaild/API";
import { toast } from "sonner";
import Loading from "@/components/customUi/loading";
import Image from "next/image";

const EditCompanyForm = () => {
  const { id } = useParams();

  const router = useRouter();

  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/${Supplier}/${id}`,
    fetcher
  );
  const company: Compny = data?.data || {};

  const { register, handleSubmit, setValue, reset } = useForm<Compny>();

  console.log(company);
  useEffect(() => {
    if (company && company.id) {
      reset(company);
    }
  }, [company, reset]);

  if (isLoading) return <div>{<Loading />}</div>;
  if (error || !company) return <div>Error loading company data.</div>;
  const onSubmit = async (company: Compny) => {
    try {
      const formData = new FormData();
      const photoFile = (company.photo as unknown as FileList)[0];
      if (photoFile) {
        formData.append("file", photoFile);
      }

      formData.append("type", "company");
      formData.append("companyId", id as string);
      formData.append("general_alert", company.general_alert || "");
      formData.append("address", company.address || "");
      formData.append("phone", company.phone || "");
      formData.append("Name", company.name || "");
      formData.append("status", company.status || "");

      const response = await fetch(`${BASE_URL}/${Supplier}/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update company");

      mutate();
      toast.success("Company updated successfully!");
      router.push("/dashboard/companies");
    } catch (err) {
      console.error(err);
      toast.error("Error updating company.");
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-4 max-w-xl mx-auto"
    >
      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          defaultValue={data.status}
          onValueChange={(value) => setValue("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
            <SelectItem value="INACTIVE">INACTIVE</SelectItem>
            <SelectItem value="PENDING">PENDING</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="general_alert">General Alert</Label>
        <Textarea id="general_alert" {...register("general_alert")} />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" {...register("address")} />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" {...register("phone")} />
      </div>

      <div>
        <Label htmlFor="Name">Company Name</Label>
        <Input id="Name" {...register("name")} />
      </div>
      <div>
        <Label htmlFor="photo">Company Logo</Label>
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
        <Image
          src={`/uploads/${company.photo || "default.jpg"}`}
          alt="Company Logo"
          width={80}
          height={80}
        />
      </div>

      <Button type="submit">Save Changes</Button>
    </form>
  );
};

export default EditCompanyForm;
