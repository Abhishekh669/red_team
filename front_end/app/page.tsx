'use client';
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function  Home(){
  const handle_login = () =>{
    window.location.href = "/api/auth/google";
  }
  const router = useRouter()
  return (
    <div className="w-full h-full flex gap-x-4 items-center justify-center">
      <Button
        onClick={handle_login}
      >
        login with google
      </Button>

      <Button
        onClick={() => router.push("/dashboard")}
      >
        dashboard
      </Button>
    </div>
  )
}