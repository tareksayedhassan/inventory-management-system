import React from "react";
import { Card, CardContent, CardTitle } from "../ui/card";
import { BASE_URL, EznEdafa, EznEdafaProduct } from "@/apiCaild/API";
import useSWR from "swr";
import { fetcher } from "@/apiCaild/fetcher";
import Loading from "./loading";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
interface dataProps {
  id: number;
}
const EditEznEdafa = ({ id }: dataProps) => {
  const { data, isLoading, mutate } = useSWR(
    `${BASE_URL}/${EznEdafa}/${id}`,
    fetcher
  );

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  const EditEznEdafaData = data?.data || {};
  console.log(EditEznEdafaData.products);

  const deleteRecord = async (id: string) => {
    try {
      await fetch(`${BASE_URL}/${EznEdafaProduct}/${id}`, {
        method: "DELETE",
      });
      mutate();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };
  return (
    <div dir="rtl">
      <Card>
        <CardContent>
          <CardTitle className="text-center">
            اذن اضافه رقم {EditEznEdafaData.id}
          </CardTitle>

          <div className="border-b-2 border-blue-200 mb-4">
            <Label className="mb-3 font-bold">المورد</Label>
            <Select disabled defaultValue={EditEznEdafaData.supplier.name}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EditEznEdafaData.supplier.name}>
                  {EditEznEdafaData.supplier.name}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Card>
            <CardContent>
              <div className="w-full overflow-x-hidden">
                <div className="overflow-hidden rounded-lg shadow">
                  <Table className="min-w-full divide-y divide-gray-300 text-sm text-gray-700">
                    <TableHeader className="bg-gray-100 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="px-4 py-3 text-center min-w-[120px]">
                          التسلسل{" "}
                        </TableHead>

                        <TableHead className="px-4 py-3 text-center min-w-[110px]">
                          كود الصنف{" "}
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center min-w-[110px]">
                          اسم الصنف
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center min-w-[90px] hidden sm:table-cell">
                          الكميه{" "}
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center min-w-[130px] hidden md:table-cell">
                          السعر{" "}
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center min-w-[100px]">
                          الخصم{" "}
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center min-w-[100px]">
                          الاجمالي{" "}
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center min-w-[130px]">
                          اجراء{" "}
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {EditEznEdafaData.products &&
                        EditEznEdafaData.products.map(
                          (tra: any, index: number) => (
                            <TableRow
                              key={`${tra.id}-${index}`}
                              className="hover:bg-gray-50 transition"
                            >
                              <TableCell className="px-4 py-2 text-center">
                                {index + 1}
                              </TableCell>

                              <TableCell className="px-4 py-2 text-center">
                                {tra.product.productCode || "--"}
                              </TableCell>
                              <TableCell className="px-4 py-2 text-center">
                                {tra.product.name || "--"}
                              </TableCell>
                              <TableCell className="px-4 py-2 text-center hidden sm:table-cell">
                                {tra.amount || "--"}
                              </TableCell>
                              <TableCell className="px-4 py-2 text-center hidden sm:table-cell">
                                {tra.product.price || "--"}
                              </TableCell>
                              <TableCell className="px-4 py-2 text-center hidden sm:table-cell">
                                {tra.s || "--"}
                              </TableCell>
                              <TableCell className="px-4 py-2 text-center hidden sm:table-cell">
                                {tra.itemTotal || "--"}
                              </TableCell>
                              <TableCell className="px-4 py-2 text-center hidden sm:table-cell">
                                <div className="flex justify-center items-center gap-2 flex-wrap">
                                  <Button
                                    variant="secondary"
                                    className="bg-red-300 px-3 py-1 text-sm"
                                    onClick={() => deleteRecord(tra.id)}
                                  >
                                    الحذف
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    className="bg-yellow-100 px-3 py-1 text-sm"
                                  >
                                    التعديل
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-2 text-center"></TableCell>
                            </TableRow>
                          )
                        )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditEznEdafa;
