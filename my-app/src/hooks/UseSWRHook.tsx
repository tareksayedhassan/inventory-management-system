"use client";
import { BASE_URL } from "@/apiCaild/API";
import { fetcher } from "@/apiCaild/fetcher";
import React from "react";
import useSWR from "swr";
interface ApiProps {
  dataProps: string;
  currentPage: number;
  rowsPerPage: number;
  search?: string;
  id: number;
}
const UseSWRHook = ({
  dataProps,
  currentPage,
  rowsPerPage,
  search,
  id,
}: ApiProps) => {
  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/${dataProps}/${id}?page=${currentPage}&pageSize=${rowsPerPage}&search=${search}`,
    fetcher
  );

  return { data, error, isLoading, mutate };
};

export default UseSWRHook;
