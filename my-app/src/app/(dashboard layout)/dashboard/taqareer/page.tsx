"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { fetcher } from "@/apiCaild/fetcher";
import { BASE_URL, Products } from "@/apiCaild/API";
import useSWR from "swr";
import ProductMovement from "@/components/taqareer/ProductMovement";

export default function ReportsComponent() {
  const [mode, setMode] = useState<"item-movement" | "create">("create");
  const [selectedItemId, setSelectedItemId] = useState<string>("");

  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const { data, isLoading } = useSWR(`${BASE_URL}/${Products}`, fetcher);
  const product = data?.data || [];
  console.log("product Data:", product);

  return (
    <>
      <div className="space-y-6 mt-5" dir="rtl">
        <Card className="border dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold border-b border-blue-200 text-start pb-2 mb-4 pr-3.5">
              التقارير
            </CardTitle>
          </CardHeader>
          <CardContent dir="ltr">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t dark:border-gray-600">
              <div>
                <Label className="mb-1 text-sm font-medium">اختر التقرير</Label>
                <Select
                  value={mode}
                  onValueChange={(value) =>
                    setMode(value as "item-movement" | "create")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="-- اختر --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="create">-- اختر --</SelectItem>
                    <SelectItem value="item-movement">حركة صنف</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1 text-sm font-medium">من تاريخ</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="mb-1 text-sm font-medium">إلى تاريخ</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full"
                />
              </div>

              {mode === "item-movement" && (
                <>
                  <div>
                    <Label className="mb-1 text-sm font-medium">الصنف</Label>
                    <Select
                      value={selectedItemId}
                      onValueChange={(value) => setSelectedItemId(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر صنف..." />
                      </SelectTrigger>
                      <SelectContent>
                        {product.length > 0 ? (
                          product.map((i: any) => (
                            <SelectItem key={i.id} value={i.id}>
                              {i.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-items" disabled>
                            لا يوجد اصناف لعرضها
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {selectedItemId && <ProductMovement id={selectedItemId} />}
    </>
  );
}
