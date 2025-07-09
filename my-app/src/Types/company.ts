export type Compny = {
  id: number;
  photo: string;
  status: string; // أو CompStatus لو معرف enum
  general_alert: string;
  address: string;
  phone: string;
  company_code: string;
  added_by_id: number;
  updated_by_id: number;
  createdAt: String;
  updatedAt: String;
};
