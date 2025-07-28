"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: string;
  productCode: string;
};

type AlertProps = {
  products: Product[];
  selectedProductId: number | null;
  setSelectedProductId: (id: number) => void;
  selectedProducts: (Product & { amount: number; buyPrice: number })[];
  setSelectedProducts: (
    products: (Product & { amount: number; buyPrice: number })[]
  ) => void;
};

const SelectedData = ({
  products,
  selectedProductId,
  selectedProducts,
  setSelectedProducts,
}: AlertProps) => {
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="space-y-6">
      {/* Start selected product details */}
      {selectedProduct && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              كود الصنف
            </label>
            <input
              type="text"
              value={selectedProduct.productCode}
              readOnly
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              اسم الصنف
            </label>
            <input
              type="text"
              value={selectedProduct.name}
              readOnly
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              الوحدة
            </label>
            <input
              type="text"
              value={selectedProduct.stock}
              readOnly
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              تكلفة الشراء
            </label>
            <input
              type="number"
              value={selectedProduct.price}
              readOnly
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>
        </div>
      )}

      {/* Start table of selected products */}
      <div className="overflow-x-auto">
        <Table className="min-w-full border text-center whitespace-nowrap">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="min-w-[100px] text-center">
                كود الصنف
              </TableHead>
              <TableHead className="min-w-[150px] text-center">
                اسم الصنف
              </TableHead>
              <TableHead className="min-w-[100px] text-center">
                الكمية
              </TableHead>
              <TableHead className="min-w-[120px] text-center">
                تكلفة الواحدة
              </TableHead>
              <TableHead className="min-w-[120px] text-center">
                الإجمالي بالجنيه
              </TableHead>
              <TableHead className="min-w-[100px] text-center">
                إجراءات
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {selectedProducts.map((product, index) => {
              const total = product.amount * product.price;

              return (
                <TableRow
                  key={`${product.id}-${index}`}
                  className="hover:bg-gray-50 align-middle"
                >
                  <TableCell className="align-middle text-center">
                    {product.productCode}
                  </TableCell>
                  <TableCell className="align-middle text-center">
                    {product.name}
                  </TableCell>
                  <TableCell className="align-middle text-center">
                    {product.amount}
                  </TableCell>
                  <TableCell className="align-middle text-center">
                    {product.price.toFixed(2)} ج.م
                  </TableCell>
                  <TableCell className="align-middle text-center font-medium text-green-700">
                    {total.toFixed(2)} ج.م
                  </TableCell>
                  <TableCell className="align-middle">
                    <Button
                      variant="destructive"
                      className="text-sm px-3 py-1 cursor-pointer"
                      onClick={() => {
                        setSelectedProducts(
                          selectedProducts.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      حذف
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SelectedData;
