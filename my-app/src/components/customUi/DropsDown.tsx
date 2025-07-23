"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const DropsDown = () => {
  return (
    <Accordion type="multiple" className="w-full text-right" dir="rtl">
      <AccordionItem value="general-Company">
        <AccordionTrigger> عملاء / موردين</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="/dashboard/Supplier">قائمه الموردين </Link>
          <Link href="/dashboard/companies">قائمة العملاء</Link>
          <Link href="/dashboard/treasury">الخزائن</Link>
          <Link href="#">الفريق</Link>
          <Link href="#">الاشتراك</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="accounts">
        <AccordionTrigger>ادارة الاصناف</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="/dashboard/Products"> عرض الاصناف</Link>
          <Link href="/dashboard/Products/add"> اضافه صنف جديد</Link>
          <Link href="/dashboard/categories"> اقسام الاصناف</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="warehouse-Company">
        <AccordionTrigger>المشتريات</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#">المخازن</Link>
          <Link href="#">أنواع المخزون</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="stock-movement">
        <AccordionTrigger>المبيعات</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#">إضافة حركة</Link>
          <Link href="#">تتبع الحركة</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="sales">
        <AccordionTrigger>المرتجعات</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#">فاتورة بيع</Link>
          <Link href="#">مرتجعات</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="services">
        <AccordionTrigger>تسويات المخزون</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#">الخدمات الداخلية</Link>
          <Link href="#">الخدمات الخارجية</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="cash-shift">
        <AccordionTrigger>اداره الخزن</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#">بداية الشفت</Link>
          <Link href="#">نهاية الشفت</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="users">
        <AccordionTrigger>المصروفات</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#">اضافه مصروف</Link>
          <Link href="#">تقارير المصروفات يومي وشهري</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="reports">
        <AccordionTrigger>حسابات الموردين</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#"> اضافه مورد</Link>
          <Link href="#"> فواتير الموردين</Link>
          <Link href="#"> كشف حساب الموردين</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="support">
        <AccordionTrigger> حسابات العملاء</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#"> فواتير العملاء</Link>
          <Link href="#">كشف حساب العميل</Link>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DropsDown;
