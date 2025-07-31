"use client";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

type PagentionProps = {
  totalItems: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
};

const Pagention = ({
  totalItems,
  currentPage,
  setCurrentPage,
  rowsPerPage,
}: PagentionProps) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  return (
    <div className="flex justify-center items-center mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                console.log("Previous clicked, currentPage:", currentPage);
                if (currentPage > 1) setCurrentPage((prev) => prev - 1);
              }}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationItem key={index}>
              <Button
                variant={currentPage === index + 1 ? "default" : "outline"}
                onClick={() => {
                  console.log("Page clicked, new page:", index + 1);
                  setCurrentPage(index + 1);
                }}
              >
                {index + 1}
              </Button>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                console.log("Next clicked, currentPage:", currentPage);
                if (currentPage < totalPages)
                  setCurrentPage((prev) => prev + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Pagention;
