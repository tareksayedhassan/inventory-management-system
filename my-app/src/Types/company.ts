export type Compny = {
  id: number;
  photo?: string;
  status: string;
  general_alert: string;
  address: string;
  phone: string;
  Name: string;
  added_by_id: number;
  updated_by_id: number;
  createdAt: String;
  updatedAt: String;
  added_by?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};
