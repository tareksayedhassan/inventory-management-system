import LoginForm from "@/components/login-form";
import Image from "next/image";
import React from "react";
import logo from "../../../public/assets/inventory-management-icon-monochrome-simple-600w-2361436289.webp";

const page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen h-screen px-4 overflow-hidden">
      <div className="flex flex-col items-center gap-6 shadow-xl bg-white/80 rounded-xl p-10 w-full max-w-md border border-black">
        <Image
          src={logo}
          alt="Logo"
          width={150}
          height={100}
          className="rounded-md"
        />
        <div className="w-full h-[90%]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default page;
