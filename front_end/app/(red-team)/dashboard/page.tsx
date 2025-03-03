"use client";
import StudentDashboard from "@/components/dashboard/student-dashboard";
import useSidebar from "@/components/ui/sidebar";
import Link from "next/link";
import React, { useEffect } from "react";

function Page() {
  const { isMobile, setOpenMobile } = useSidebar();
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);
  return (
    <div className="h-[calc(100vh-70px)] lg:h-[calc(100vh-70px)] overflow-y-auto  max-w-screen w-screen md:max-w-full md:w-full  bg-black text-white p-1">
      <StudentDashboard />
    </div>
  );
}

export default Page;
