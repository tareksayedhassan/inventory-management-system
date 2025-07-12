import Link from "next/link";
import React from "react";
import showCompanyes from "../../../../public/assets/home page/undraw_business-decisions_3x2a.svg";
import safe from "../../../../public/assets/home page/Banknote-bro.svg";

import Image from "next/image";

const Page = () => {
  return (
    <div className="h-full flex w-full justify-center items-center dark:bg-gray-800 p-2">
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 md:p-2 xl:p-5">
        {/* start card */}
        <div className="relative bg-white border rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 transform transition duration-500 hover:scale-105">
          <div className="absolute top-3 right-3 rounded-full bg-violet-600 text-gray-200 w-6 h-6 text-center">
            1
          </div>
          <div className="p-2 flex justify-center">
            <Link href="/dashboard/companies">
              <Image
                className="rounded-md"
                src={showCompanyes}
                loading="lazy"
                alt="Card"
                width={180}
                height={180}
              />
            </Link>
          </div>
          <div className="px-4 pb-3">
            <a href="#">
              <h5 className="text-xl font-semibold tracking-tight hover:text-violet-800 dark:hover:text-violet-300 text-gray-900 dark:text-white">
                قائمه الشركات / الموردين
              </h5>
            </a>
            <p className="antialiased text-gray-600 dark:text-gray-400 text-sm break-all">
              تصفح قائمه الموردين بسهوله
            </p>
          </div>
        </div>
        {/* end card */}
        {/* start card */}
        <div className="relative bg-white border rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 transform transition duration-500 hover:scale-105 hover:bg-amber-400">
          <div className="absolute top-3 right-3 rounded-full bg-violet-600 text-gray-200 w-6 h-6 text-center">
            2
          </div>
          <div className="p-2 flex justify-center">
            <Link href="/dashboard/treasury">
              <Image
                className="rounded-md"
                src={safe}
                loading="lazy"
                alt="Card"
                width={180}
                height={180}
              />
            </Link>
          </div>
          <div className="px-4 pb-3">
            <a href="#">
              <h5 className="text-xl font-semibold tracking-tight hover:text-violet-800 dark:hover:text-violet-300 text-gray-900 dark:text-white">
                الخزينة
              </h5>
            </a>
            <p className="antialiased text-gray-600 dark:text-gray-400 text-sm break-all">
              تابع حركه الخزينه بكل سهوله
            </p>
          </div>
        </div>
        {/* end card */}
      </div>
    </div>
  );
};

export default Page;
