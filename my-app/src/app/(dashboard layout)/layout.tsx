"use client";

import MobileSideBar from "@/components/customUi/MobilSidebar";
import SideBar from "@/components/customUi/Sidebar";
import TopBar from "@/components/customUi/TopBar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] overflow-x-hidden">
      <TopBar />
      <div style={{ display: "flex", flex: 1 }}>
        <main
          className="main-content"
          style={{
            flex: 1,
            padding: "2rem 1rem",
            paddingTop: "70px",
            backgroundColor: "#f9f9f9",
            overflowX: "hidden", // إضافة هنا
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
              overflowX: "hidden", // إضافة هنا
            }}
          >
            {children}
          </div>
        </main>
        {/* Desktop Sidebar */}
        <div className="hidden xl:flex items-center gap-8">
          <div style={{ width: "200px", flexShrink: 0 }}>
            <SideBar />
          </div>
        </div>
        {/* Mobile Sidebar */}
        <div className="xl:hidden">
          <div style={{ flexShrink: 0 }}>
            <MobileSideBar />
          </div>
        </div>
      </div>
    </div>
  );
}
