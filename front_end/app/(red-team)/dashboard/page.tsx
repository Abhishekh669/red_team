"use client";
import AdminDashboard from "@/components/admin/admin-dashboard/admin-dashboard";
import StudentDashboard from "@/components/dashboard/student-dashboard";
import useSidebar from "@/components/ui/sidebar";
import { useAdminStore } from "@/utils/store/use-admin-store";
import Link from "next/link";
import React, { useEffect } from "react";

function Page() {

  const {AdminStatus} = useAdminStore();
  const { isMobile, setOpenMobile } = useSidebar();
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);
  return (
    <div className="h-[calc(100vh-70px)] lg:h-[calc(100vh-70px)] overflow-y-auto  bg-black text-white p-1">
     {
      AdminStatus  ? (<AdminDashboard />) : (<StudentDashboard />) 
     }
    </div>
  );
}

export default Page;
