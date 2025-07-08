import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import React from "react";
import logo from "../../../public/assets/inventory-management-icon-monochrome-simple-600w-2361436289.webp";
const page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br px-4 ">
      <div className="flex flex-col justify-center items-center shadow-2xs bg-amber-50">
        <Image src={logo} alt="icone" width={150} height={100} />
        <div className=" shadow-lg rounded-xl p-8 w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default page;
