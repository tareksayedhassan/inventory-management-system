"use client";
import RegisterForm from "@/components/registerForm";
import Image from "next/image";
import React from "react";
import Work from "../../../public/assets/Work.png";

const page = () => {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      <div className="flex justify-center items-center p-6 bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md p-6 rounded-2xl shadow-md">
          <RegisterForm />
        </div>
      </div>

      <div className="hidden md:flex justify-center items-center bg-white dark:bg-gray-950">
        <Image
          src={Work}
          alt="register"
          className="max-w-[80%] h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default page;
