"use client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import toast from "react-hot-toast";
import OnboardingPage from "@/components/onboarding/onboarding";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import Hint from "@/components/Hint";
import { useCreateOnboarding } from "@/utils/store/onboarding/use-create-onboarding";
import { useGetSession } from "@/utils/hooks/query-hooks/sessions/use-get-sessions";
import { useGetAdminByToken } from "@/utils/hooks/query-hooks/admin/use-get-admin-by-token";
import { adminRoute } from "@/lib";
import { Loader } from "@/components/ui/Loader";
import { useAdminStore } from "@/utils/store/use-admin-store";
import { useSessionStore } from "@/utils/store/use-session-store";

function MainAppLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading: user_loading } = useGetSession();
  const { setAdmin } = useAdminStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [open_board, setOpen_Board] = useCreateOnboarding();
  const { data: admin, isLoading: admin_loading } = useGetAdminByToken();
  const { setSession } = useSessionStore();

  const isOnboarded = useMemo(() => user?.user?.isOnBoarded, [user?.user]);
  const isAdmin = useMemo(() => {
    if (user_loading || admin_loading) return false;
    const status = !!(user?.user?.isAdmin && admin?.admin_data);
    return status;
  }, [user?.user, admin?.admin_data, user_loading, admin_loading]);

  // Prefetch routes
  useEffect(() => {
    // Prefetch dashboard route
    router.prefetch("/dashboard");

    // Prefetch admin verification route if user is an admin
    if (user?.user?.isAdmin) {
      router.prefetch("/admin/admin-verification");
    }

    // Prefetch other frequently accessed routes
    router.prefetch("/profile");
    router.prefetch("/settings");
  }, [router, user?.user]);

  useEffect(() => {
    if (user_loading) return;
    if (user?.user) {
      setSession(user?.user);
    }
  }, [user_loading, user?.user]);

  useEffect(() => {
    if (isAdmin) setAdmin(isAdmin);
  }, [isAdmin, setAdmin]);

  useEffect(() => {
    if (user_loading || admin_loading) return;

    const isAdminRoute = adminRoute.some((route) => pathname.includes(route));

    if (isAdminRoute) {
      if (!isAdmin) {
        // If not an admin, redirect to dashboard
        toast.error("Not authorized");
        router.push("/dashboard");
      } else if (!admin?.admin_data) {
        // If admin token is invalid, redirect to admin verification
        toast.error("Please log in as an admin.");
        router.push("/admin/admin-verification");
      }
    }
  }, [pathname, user_loading, admin_loading, isAdmin, admin?.admin_data, router]);

  useEffect(() => {
    if (user_loading) return;
    if (!isOnboarded) {
      setOpen_Board(true);
    } else if (isOnboarded === true) {
      setOpen_Board(false);
    }
  }, [isOnboarded, setOpen_Board, user_loading, user?.user]);

  return (
    <SidebarProvider>
      <AppSidebar
        user={user?.user}
        user_loading={user_loading}
        isAdmin={isAdmin || false}
      />
      <OnboardingPage onboardingOption={open_board} userId={user?.user?._id} />
      <SidebarInset className="bg-black ">
        <header className="flex h-[70px] md:h-[64px] bg-black border-x border-b border-x-gray-200 border-b-gray-200 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 p-4 text-red-600 ">
          <Hint label={isOpen ? "collapse" : "expand"}>
            <SidebarTrigger
              className="-ml-1"
              onClick={() => setIsOpen((prev) => !prev)}
            />
          </Hint>
          <Breadcrumb className="w-full flex justify-between text-red-600 px-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <div className="w-full flex justify-between px-2 py-1 text-red-600">
                  add someting
                </div>
              </BreadcrumbItem>
            </BreadcrumbList>
            <BreadcrumbList>
              <BreadcrumbLink>
                <div></div>
              </BreadcrumbLink>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <>
          {user_loading  ? (
            <Loader />
          ) : (
            <>
              {( (user?.user && user?.user?.isVerified) || isAdmin) ? (
                <div className="w-full h-full bg-black">{children}</div>
              ) : (
                <div className="w-full h-full flex justify-center items-center text-white">
                  Wait till being verified
                </div>
              )}
            </>
          )}
        </>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default MainAppLayout;