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

interface Item {
  id: string;
  name: string;
}

interface ReportsComponentProps {
  reportType: string;
  dateFrom: string;
  dateTo: string;
  selectedItemId: string;
  store: {
    items: Item[];
  };
}

export default function ReportsComponent({
  reportType,
  dateFrom,
  dateTo,
  selectedItemId,
  store,
}: ReportsComponentProps) {
  const [mode, setMode] = useState<"item-movement" | "create">("create");

  return (
    <div className="space-y-6 mt-5" dir="rtl">
      <Card className="border dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold border-b border-blue-200 text-start pb-2 mb-4 pr-3.5">
            التقارير
          </CardTitle>
        </CardHeader>
        <CardContent className="" dir="ltr">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t dark:border-gray-600">
            <div>
              <Label className="mb-1 text-sm font-medium">اختر التقرير</Label>
              <Select value={reportType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-- اختر --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select-report">-- اختر --</SelectItem>
                  <SelectItem
                    value="item-movement"
                    onClick={() => setMode("item-movement")}
                  >
                    حركة صنف
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-1 text-sm font-medium">من تاريخ</Label>
              <Input type="date" value={dateFrom} className="w-full" />
            </div>

            <div>
              <Label className="mb-1 text-sm font-medium">إلى تاريخ</Label>
              <Input type="date" value={dateTo} className="w-full" />
            </div>

            {mode === "item-movement" && (
              <div>
                <Label className="mb-1 text-sm font-medium">الصنف</Label>
                <Select value={selectedItemId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر صنف..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select-item">اختر صنف...</SelectItem>
                    {store.items.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
