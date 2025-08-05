import React from "react";

type Product = {
  id: number;
  name: string;
  productCode: string;
  amount: number;
  buyPrice: number;
};

type Props = {
  selectedSupplier?: {
    id: number;
    name: string;
  };
  selectedProducts: Product[]; // ✅ هنا الصح
  totalAmountBeforeSubmit: number;
  taxx: number;
  deduction: number;
  finalTotal: number;
  isTaxChecked: boolean;
};

const PrintableComponent = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      selectedSupplier,
      selectedProducts,
      totalAmountBeforeSubmit,
      taxx,
      deduction,
      finalTotal,
      isTaxChecked,
    },
    ref
  ) => {
    const currentDate = new Date().toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div ref={ref} className="p-8 bg-white text-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">إذن إضافة</h1>
          <p className="text-gray-600">تاريخ: {currentDate}</p>
        </div>

        {/* بيانات المورد */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            بيانات المورد
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">اسم المورد:</p>
              <p className="text-gray-700">
                {selectedSupplier?.name || "غير محدد"}
              </p>
            </div>
          </div>
        </div>

        {/* البضاعة المضافة */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            البضاعة المضافة
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-right border">اسم المنتج</th>
                <th className="p-3 text-right border">الكمية</th>
                <th className="p-3 text-right border">سعر الشراء</th>
                <th className="p-3 text-right border">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product: any) => (
                <tr key={product.id} className="border-b">
                  <td className="p-3 border">{product.name}</td>
                  <td className="p-3 border">{product.amount}</td>
                  <td className="p-3 border">
                    {product.buyPrice.toFixed(2)} ج.م
                  </td>
                  <td className="p-3 border">
                    {(product.amount * product.buyPrice).toFixed(2)} ج.م
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* حسابات */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <div className="lg:col-span-1 space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">
                نسبة الضريبة (%)
              </label>
              <input
                type="number"
                value={14}
                className="w-full p-2 border rounded"
                disabled
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">
                خصم المنبع (%)
              </label>
              <input
                type="number"
                value={1}
                className="w-full p-2 border rounded"
                disabled
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg text-center shadow-md border">
                <p className="text-sm text-gray-500">الإجمالي الفرعي</p>
                <p className="text-xl font-bold font-numeric text-gray-800">
                  {totalAmountBeforeSubmit.toFixed(2)} ج.م
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg text-center shadow-md border">
                <p className="text-sm text-gray-500">الضريبة (14%)</p>
                <p className="text-xl font-bold font-numeric text-gray-800">
                  {taxx.toFixed(2)} ج.م
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg text-center shadow-md border">
                <p className="text-sm text-gray-500">خصم المنبع (1%)</p>
                <p className="text-xl font-bold font-numeric text-red-500">
                  -{deduction.toFixed(2)} ج.م
                </p>
              </div>
            </div>
            <div className="bg-blue-600 text-white p-4 rounded-lg text-center shadow-lg mt-4">
              <p className="text-lg font-semibold">الإجمالي النهائي</p>
              <p className="text-3xl font-bold font-numeric tracking-wider">
                {finalTotal.toFixed(2)} ج.م
              </p>
            </div>
          </div>
        </div>

        {/* التواقيع */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex justify-around">
            <div className="text-center">
              <p className="font-medium">توقيع المستلم</p>
              <div className="h-16 mt-4 border-t border-dashed w-40"></div>
            </div>
            <div className="text-center">
              <p className="font-medium">توقيع المسؤول</p>
              <div className="h-16 mt-4 border-t border-dashed w-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrintableComponent.displayName = "PrintableComponent";

export default PrintableComponent;
