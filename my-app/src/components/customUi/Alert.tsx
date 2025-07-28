"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: string;
  productCode: string;
};

type AlertProps = {
  search: string;
  setSearch: (value: string) => void;
  products: Product[];
  selectedProductId: number | null;
  setSelectedProductId: (id: number) => void;
  selectedProducts: (Product & { amount: number; buyPrice: number })[];
  setSelectedProducts: (
    products: (Product & { amount: number; buyPrice: number })[]
  ) => void;
};
const Alert = ({
  search,
  setSearch,
  products,
  selectedProductId,
  setSelectedProductId,
  selectedProducts,
  setSelectedProducts,
}: AlertProps) => {
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="
                      bg-green-600 
                      text-white 
                      hover:bg-green-700 
                      transition-colors 
                      duration-200 
                      rounded-lg 
                      px-8 
                      py-3 
                      flex 
                      items-center 
                      gap-2 
                      font-semibold
                      shadow-md
                      hover:shadow-lg
                    "
          >
            إضافة صنف <FaSearch />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          className="
                    w-[95vw] 
                    max-w-[90vw] 
                    h-[70vh] 
                    bg-white 
                    rounded-2xl 
                    shadow-xl 
                    p-8 
                    border 
                    border-gray-100 
                    transition-all 
                    duration-300 
                    ease-in-out
                    flex 
                    flex-col
                    bg-gradient-to-br 
                    from-gray-50 
                    to-green-50
                  "
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-gray-800 mb-4 text-center">
              اختيار الأصناف
            </AlertDialogTitle>
            <div className="w-full max-w-lg mx-auto mb-6">
              <Input
                type="search"
                placeholder="ابحث باسم الصنف..."
                className="
                          rounded-lg 
                          border 
                          border-gray-200 
                          px-4 
                          py-3 
                          w-full 
                          focus:ring-2 
                          focus:ring-green-400 
                          focus:outline-none 
                          text-gray-700
                          transition-all 
                          duration-200
                          bg-white
                          shadow-sm
                          hover:shadow-md
                        "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </AlertDialogHeader>

          <AlertDialogDescription className="flex-1 overflow-auto">
            <div className="w-full">
              <Table className="w-full text-center border border-gray-100 rounded-lg bg-white shadow-sm">
                <TableHeader>
                  <TableRow className="bg-gray-50 text-gray-700 font-semibold">
                    <TableHead className="w-1/4 text-center border py-3">
                      تكلفة الشراء
                    </TableHead>
                    <TableHead className="w-1/4 text-center border py-3">
                      الكمية
                    </TableHead>
                    <TableHead className="w-2/4 text-center border py-3">
                      اسم الصنف
                    </TableHead>
                    <TableHead className="w-1/4 text-center border py-3">
                      كود الصنف
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products
                    .filter((item) =>
                      item.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((item, key) => (
                      <TableRow
                        key={key}
                        className="
                                  hover:bg-green-100 
                                  transition-colors 
                                  duration-200 
                                  cursor-pointer
                                "
                        onClick={() => setSelectedProductId(item.id)}
                      >
                        <TableCell className="text-center border py-3">
                          {item.price.toFixed(2)} ج.م
                        </TableCell>
                        <TableCell className="text-center border py-3">
                          {item.stock}
                        </TableCell>
                        <TableCell className="text-center border py-3">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-center border py-3">
                          {item.productCode}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </AlertDialogDescription>

          <AlertDialogFooter className="mt-6 flex justify-end gap-4">
            <AlertDialogCancel
              className="
                        bg-gray-200 
                        text-gray-700 
                        hover:bg-gray-300 
                        transition-colors 
                        duration-200 
                        rounded-lg 
                        px-6 
                        py-2
                        shadow-md
                        hover:shadow-lg
                      "
            >
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              className="
                        bg-green-600 
                        text-white 
                        hover:bg-green-700 
                        transition-colors 
                        duration-200 
                        rounded-lg 
                        px-6 
                        py-2
                        shadow-md
                        hover:shadow-lg
                      "
              onClick={() => {
                if (selectedProductId) {
                  const product = products.find(
                    (p) => p.id === selectedProductId
                  );
                  if (product) {
                    setSelectedProducts([
                      ...selectedProducts,
                      {
                        ...product,
                        amount: 1,
                        buyPrice: product.price,
                      },
                    ]);
                    toast.success("تم إضافة الصنف بنجاح.");
                  }
                }
              }}
            >
              متابعة
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Alert;
