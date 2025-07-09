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
    <div style={{ backgroundColor: "#f9f9f9" }}>
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <TopBar />
        <div style={{ display: "flex", flex: 1 }}>
          {/* Main content first */}
          <main
            className="main-content"
            style={{
              flex: 1,
              padding: "2rem",
              backgroundColor: "#f9f9f9",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "1200px",
                marginTop: "4rem",
              }}
            >
              {children}
            </div>
          </main>

          {/* Desktop Sidebar on the right */}
          <div className="hidden xl:flex items-center gap-8">
            <div style={{ width: "200px", flexShrink: 0 }}>
              <SideBar />
            </div>
          </div>

          {/* Mobile Sidebar on the right */}
          <div className="xl:hidden">
            <div style={{ flexShrink: 0 }}>
              <MobileSideBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
