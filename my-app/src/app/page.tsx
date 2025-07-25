"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DecodedToken } from "@/Types/CustomJWTDecoded";
import { jwtDecode } from "jwt-decode";
import Cookie from "cookie-universal";
import Loading from "@/components/customUi/loading";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const cookie = Cookie();
    const token = cookie.get("Bearer");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      if (decoded.role === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch (error) {
      router.push("/login");
    }
  }, []);

  return <Loading />;
}
