export type Compny = {
  id: number;
  photo?: string;
  status: string;
  general_alert: string;
  address: string;
  phone: string;
  name: string;
  added_by_id: number;
  updated_by_id: number;
  createdAt: string;
  updatedAt: string;
  added_by?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  transactions: [];
};
