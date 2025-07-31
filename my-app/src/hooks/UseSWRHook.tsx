"use client";
import { BASE_URL } from "@/apiCaild/API";
import { fetcher } from "@/apiCaild/fetcher";
import useSWR from "swr";

interface ApiProps {
  dataProps: string;
  currentPage?: number;
  rowsPerPage?: number;
  search?: string;
  id?: number;
}

const UseSWRHook = ({
  dataProps,
  currentPage,
  rowsPerPage,
  search,
  id,
}: ApiProps) => {
  // بناء رابط الأساس
  let url = `${BASE_URL}/${dataProps}`;

  // لو فيه ID ضيفه
  if (id !== undefined) {
    url += `/${id}`;
  }

  // بناء باراميترات البحث
  const queryParams: string[] = [];

  if (currentPage !== undefined) queryParams.push(`page=${currentPage}`);
  if (rowsPerPage !== undefined) queryParams.push(`pageSize=${rowsPerPage}`);
  if (search) queryParams.push(`search=${search}`);

  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return { data, error, isLoading, mutate };
};

export default UseSWRHook;
