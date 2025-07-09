import { JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role: "ADMIN" | "USER";
}

export type DecodedToken = {
  name: string;
  email?: string;
  id?: number;
  role?: "ADMIN" | "USER";
  avatar?: string;
  createdAt?: string;
};
