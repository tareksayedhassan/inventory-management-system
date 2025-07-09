import { JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role: "admin" | "user";
}

export type DecodedToken = {
  name: string;
  email?: string;
  id?: number;
  role?: "user" | "admin";
  avatar?: string;
  createdAt?: string;
};
