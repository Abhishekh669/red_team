"use client";
import { useGetChatByToken } from "@/utils/hooks/query-hooks/chat/use-get-chat-session";
import { Loader } from "@/components/ui/Loader";
import { redirect } from "next/navigation";
import { useSocketIOStore } from "@/utils/store/use-socket-io";
import { useEffect } from "react";
import useSidebar from "@/components/ui/sidebar";

function NewChatLayout({ children }: { children: React.ReactNode }) {
  const { data: userStatus, isLoading: userStatusLoading } =
    useGetChatByToken();
     const { toggleSidebar, open, isMobile, setOpenMobile } = useSidebar();
      useEffect(() => {
        if(open) toggleSidebar();
        if (isMobile) {
          setOpenMobile(false);
        }
      }, [open, toggleSidebar, isMobile, setOpenMobile]);

  const { connectSocket, disconnectSocket } = useSocketIOStore();
  useEffect(() => {
    if (userStatusLoading || !userStatus?.status) return;
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, [userStatusLoading, userStatus?.status]);
  if (userStatusLoading) return <Loader />;
  if (userStatus?.status) {
  return <div className="w-full h-full">{children}</div>;
  } else redirect("/");
}

export default NewChatLayout;
