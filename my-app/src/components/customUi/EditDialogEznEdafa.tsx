import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { BASE_URL, EznEdafaProduct } from "@/apiCaild/API";

interface dataProps {
  id: number;
  tra: any;
}

const EditDialogEznEdafa = ({ id, tra }: dataProps) => {
  const [productCode, setproductCode] = useState("");
  const [name, setname] = useState("");
  const [amount, setamount] = useState("");
  const [price, setprice] = useState("");
  const [itemTotal, setitemTotal] = useState("");
  const [lastBuyPrice, setlastBuyPrice] = useState("");
  const productId = tra.product?.id;

  useEffect(() => {
    if (tra) {
      setproductCode(tra.product?.productCode || "");
      setname(tra.product?.name || "");
      setamount(tra.amount?.toString() || "");
      setprice(tra.product?.price?.toString() || "");
      setitemTotal(tra.itemTotal?.toString() || "");
      setlastBuyPrice(tra.product?.lastBuyPrice?.toString() || "");
    }
  }, [tra]);

  const UpdateDate = async () => {
    await fetch(`${BASE_URL}/${EznEdafaProduct}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseInt(amount),
        itemTotal: parseInt(itemTotal),
        product: {
          id: productId,
          name: name,
          productCode: productCode,
          price: parseInt(price),
          lastBuyPrice: parseInt(lastBuyPrice),
        },
      }),
    });
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">التعديل</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل المنتج</DialogTitle>
            <DialogDescription>قم بتعديل البيانات ثم احفظ.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="product-name">اسم الصنف</Label>
              <Input
                id="product-name"
                name="name"
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-code">كود الصنف</Label>
              <Input
                id="product-code"
                name="productCode"
                value={productCode}
                onChange={(e) => setproductCode(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-amount">الكمية</Label>
              <Input
                id="product-amount"
                name="amount"
                value={amount}
                onChange={(e) => setamount(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-price">السعر</Label>
              <Input
                id="product-price"
                name="price"
                value={price}
                onChange={(e) => setprice(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="item-total">الإجمالي</Label>
              <Input
                id="item-total"
                name="itemTotal"
                value={itemTotal}
                onChange={(e) => setitemTotal(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إغلاق</Button>
            </DialogClose>
            <Button type="submit" onClick={UpdateDate}>
              حفظ التغيرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditDialogEznEdafa;
