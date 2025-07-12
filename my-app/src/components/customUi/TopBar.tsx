"use client";

import Cookie from "cookie-universal";
import { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { useEffect, useState } from "react";

const TopBar = () => {
  const [user, setUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const cookie = Cookie();
    const token = cookie.get("Bearer");

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      console.log("No token found");
    }
  }, []);

  return (
    <div
      className="flex items-center justify-between px-4 shadow bg-white/80"
      style={{
        height: "70px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
      }}
    >
      <div className="flex items-center gap-2"></div>

      <div className="flex items-center gap-2 text-end flex-wrap">
        <Image
          src="/assets/logo.png!w700wp"
          height={40}
          width={40}
          alt="logo"
          className="object-contain"
        />
        <h3 className="m-0 text-sm md:text-xl font-semibold whitespace-nowrap">
          توب كوالتي
        </h3>
      </div>
    </div>
  );
};

export default TopBar;
