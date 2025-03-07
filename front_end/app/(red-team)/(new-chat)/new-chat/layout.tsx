"use client";
import { useGetChatByToken } from "@/utils/hooks/query-hooks/chat/use-get-chat-session";
import { Loader } from "@/components/ui/Loader";
import { redirect } from "next/navigation";
import { useSocketIOStore } from "@/utils/store/use-socket-io";
import { useEffect } from "react";

function NewChatLayout({ children }: { children: React.ReactNode }) {
  const { data: userStatus, isLoading: userStatusLoading } =
    useGetChatByToken();

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
