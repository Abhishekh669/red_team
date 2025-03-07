"use client";
import AdminViewStudentDashboard from "@/components/admin/admin-student-view-dashboard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import React from "react";
function page() {
  const router = useRouter();
  return (
    <div className="h-[calc(100vh-70px)] relative lg:h-[calc(100vh-70px)] overflow-y-auto  bg-black text-white p-1">
      <div className="absolute top-2 left-2">
        <Button
          variant="outline"
          className="bg-gray-900 text-white"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tests
        </Button>
      </div>
      <AdminViewStudentDashboard />
    </div>
  );
}

export default page;
