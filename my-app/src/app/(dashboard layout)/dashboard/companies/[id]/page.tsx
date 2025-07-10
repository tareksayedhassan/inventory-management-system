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
import { BASE_URL, Company } from "@/apiCaild/API";
import { toast } from "sonner";

const EditCompanyForm = () => {
  const { id } = useParams();

  const router = useRouter();
  const {
    data: company,
    error,
    isLoading,
    mutate,
  } = useSWR<Compny>(`${BASE_URL}/${Company}/${id}`, fetcher);

  // Initialize react-hook-form
  const { register, handleSubmit, setValue, reset } = useForm<Compny>();

  // Set default values once data is loaded
  useEffect(() => {
    if (company) {
      reset(company); // Fill the form with data
    }
  }, [company, reset]);

  // Loading / error state
  if (isLoading) return <div>Loading...</div>;
  if (error || !company) return <div>Error loading company data.</div>;
  const onSubmit = async (data: Compny) => {
    try {
      const formData = new FormData();

      const photoFile = (data.photo as unknown as FileList)[0];
      if (photoFile) {
        formData.append("file", photoFile);
        formData.append("type", "company");
        formData.append("companyId", id as string);

        const uploadRes = await fetch(`${BASE_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        data.photo = uploadData.fileName;
      }

      const response = await fetch(`${BASE_URL}/${Company}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          defaultValue={company.status}
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
        <Label htmlFor="company_code">Company Code</Label>
        <Input id="company_code" {...register("company_code")} />
      </div>

      <Button type="submit">Save Changes</Button>
    </form>
  );
};

export default EditCompanyForm;
