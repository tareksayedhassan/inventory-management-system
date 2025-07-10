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
        <AccordionTrigger> . إعدادات الشركات</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="/dashboard/companies">قائمة الشركات</Link>
          <Link href="/dashboard/companies/addCompany">اضافه شركه </Link>
          <Link href="#">الفوترة</Link>
          <Link href="#">الفريق</Link>
          <Link href="#">الاشتراك</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="accounts">
        <AccordionTrigger>الحسابات والنقدية</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#">الملف المالي</Link>
          <Link href="#">الحركات النقدية</Link>
          <Link href="#">تقارير المحفظة</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="warehouse-Company">
        <AccordionTrigger>ضبط المخازن</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#">المخازن</Link>
          <Link href="#">أنواع المخزون</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="stock-movement">
        <AccordionTrigger>حركات مخزنية</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#">إضافة حركة</Link>
          <Link href="#">تتبع الحركة</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="sales">
        <AccordionTrigger>حركة المبيعات</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#">فاتورة بيع</Link>
          <Link href="#">مرتجعات</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="services">
        <AccordionTrigger>خدمات داخلية وخارجية</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#">الخدمات الداخلية</Link>
          <Link href="#">الخدمات الخارجية</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="cash-shift">
        <AccordionTrigger>حركة شفت الخزينة</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#">بداية الشفت</Link>
          <Link href="#">نهاية الشفت</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="users">
        <AccordionTrigger>الصلاحيات والمستخدمين</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#">قائمة المستخدمين</Link>
          <Link href="#">إدارة الصلاحيات</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="reports">
        <AccordionTrigger>التقارير</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#">تقرير المخزون</Link>
          <Link href="#">تقرير المبيعات</Link>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="support">
        <AccordionTrigger>الدعم ومفكرتي</AccordionTrigger>
        <AccordionContent className="pr-4 flex flex-col gap-1 text-sm">
          <Link href="#">الدعم الفني</Link>
          <Link href="#">الملاحظات</Link>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DropsDown;
