import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type Compny = {
  id: number;
  photo: string;
  status: string;
  general_alert: string;
  address: string;
  phone: string;
  company_code: string;
  added_by_id: number;
  updated_by_id: number;
  createdAt: String;
  updatedAt: String;
};

const mobileTabels = ({}) => {
  return (
    <div dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default mobileTabels;
