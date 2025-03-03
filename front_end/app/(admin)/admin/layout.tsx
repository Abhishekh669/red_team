"use client";
import { Loader } from "@/components/ui/Loader";
import { useGetAdminByToken } from "@/utils/hooks/query-hooks/admin/use-get-admin-by-token";
import { useGetSession } from "@/utils/hooks/query-hooks/sessions/use-get-sessions";
import { useGetUserById } from "@/utils/hooks/query-hooks/users/use-get-user-by-id";
import { redirect, usePathname } from "next/navigation";
function AdminMainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: admin_data, isLoading: token_loading } = useGetAdminByToken();
  const { data: session } = useGetSession();
  const { data: user, isLoading: user_loading } = useGetUserById(
    session?.user?._id as string
  );

  if (token_loading || user_loading) return <Loader />;

  if (!user?.user?.isAdmin) {
    return redirect("/dashboard");
  }

  if (admin_data?.message && admin_data?.admin_data) {
    if (pathname.includes("admin-verification")) {
      return redirect("/dashboard");
    }
  }

  return <div className="w-full min-h-screen h-full">{children}</div>;
}

export default AdminMainLayout;
