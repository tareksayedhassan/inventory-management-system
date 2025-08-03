"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { SupplierStatus } from "@prisma/client";
import { format } from "date-fns"; // لتنسيق التاريخ
import { toZonedTime } from "date-fns-tz";

interface SupplierProps {
  status: SupplierStatus;
  phone: string;
  tax_number: string;
  address: string;
  note: string;
  name: string;
  Campname: string;
  balance: string;
  createdAt: Date;
  added_by_id?: number;
  addedByName: string; // حقل جديد
  isOpen: boolean;
  onClose: () => void;
}

const SupplierDialog = ({
  status,
  phone,
  tax_number,
  address,
  note,
  name,
  Campname,
  balance,
  createdAt,
  addedByName,
  isOpen,
  onClose,
}: SupplierProps) => {
  // Animations
  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.05 },
    }),
  };

  // تنسيق الحالة بلون حسب القيمة
  const statusColor = {
    [SupplierStatus.neutral]: "text-green-600",
    [SupplierStatus.creditBalance]: "text-red-600",
    [SupplierStatus.debitBalance]: "text-yellow-600",
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="font-sans p-0 rounded-xl border-0 w-full max-w-3xl h-[90vh] flex items-center justify-center"
        dir="rtl"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-white rounded-xl shadow-lg overflow-auto w-full h-full"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-6">
            <DialogHeader>
              <DialogTitle className="text-right text-2xl font-bold text-white">
                تفاصيل المورد - {name}
              </DialogTitle>
              <DialogDescription className="text-right text-teal-100">
                عرض جميع بيانات المورد بشكل منظم
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Content Grid */}
          <div className="p-6 grid grid-cols-2 gap-4 overflow-auto">
            {/* Column 1 */}
            <div className="space-y-4">
              <motion.div
                variants={itemVariants}
                custom={1}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <Label className="block text-sm text-gray-500 mb-1">
                  الاسم
                </Label>
                <p className="font-medium">{name}</p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                custom={2}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <Label className="block text-sm text-gray-500 mb-1">
                  اسم الشركة
                </Label>
                <p className="font-medium">{Campname}</p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                custom={3}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <Label className="block text-sm text-gray-500 mb-1">
                  رقم الهاتف
                </Label>
                <p className="font-medium">{phone}</p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                custom={4}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <Label className="block text-sm text-gray-500 mb-1">
                  تاريخ الإنشاء
                </Label>
                <p className="font-medium">
                  {format(
                    toZonedTime(createdAt, "Africa/Cairo"),
                    "dd/MM/yyyy hh:mm a"
                  )}{" "}
                </p>
              </motion.div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <motion.div
                variants={itemVariants}
                custom={5}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <Label className="block text-sm text-gray-500 mb-1">
                  الرقم الضريبي
                </Label>
                <p className="font-medium">{tax_number}</p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                custom={6}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <Label className="block text-sm text-gray-500 mb-1">
                  العنوان
                </Label>
                <p className="font-medium">{address}</p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                custom={7}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <Label className="block text-sm text-gray-500 mb-1">
                  الرصيد
                </Label>
                <p className="font-medium">{balance}</p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                custom={8}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <Label className="block text-sm text-gray-500 mb-1">
                  الحالة
                </Label>
                <p className={`font-medium ${statusColor[status]}`}>
                  {status === SupplierStatus.creditBalance
                    ? "له"
                    : status === SupplierStatus.debitBalance
                    ? "عليه"
                    : status === SupplierStatus.neutral
                    ? "صافي حساب"
                    : "معلق"}
                </p>
              </motion.div>
            </div>

            {/* Full-width fields */}
            <div className="col-span-2 space-y-4">
              <motion.div
                variants={itemVariants}
                custom={9}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <Label className="block text-sm text-gray-500 mb-1">
                  ملاحظات
                </Label>
                <p className="font-medium">{note || "لا توجد ملاحظات"}</p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                custom={10}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <Label className="block text-sm text-gray-500 mb-1">
                  أضيف بواسطة
                </Label>
                <p className="font-medium">{addedByName}</p>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <motion.div
              variants={itemVariants}
              custom={11}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-teal-500 text-teal-600 hover:bg-teal-50"
                >
                  إغلاق
                </Button>
              </DialogClose>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierDialog;
