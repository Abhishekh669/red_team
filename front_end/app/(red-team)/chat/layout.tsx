"use client";
import Users from "@/components/chat/users";
import useSidebar from "@/components/ui/sidebar";
import { useGetSession } from "@/utils/hooks/query-hooks/sessions/use-get-sessions";
import { useWebSocketStore } from "@/utils/store/use-websocket-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {data : session_data, isLoading : session_loading} = useGetSession();
  const { setSession, initializeWebSocket, selectedConversation} = useWebSocketStore()
  console.log("this ish te selected conversation : ", selectedConversation)
  
  const { toggleSidebar, open, isMobile, setOpenMobile } = useSidebar();
  useEffect(() => {
    if(open) toggleSidebar();
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [open, toggleSidebar, isMobile, setOpenMobile]);

  useEffect(() => {
    if(session_loading)return;
    setSession(session_data?.user)
    initializeWebSocket(session_data?.user?._id); // Initialize WebSocket connection

  }, [session_loading,initializeWebSocket, setSession, session_data?.user]);

  return (
      <div className="flex  h-full border border-blue-600 ">
        <div className="h-full  border-r hidden md:block">
          <div className=" h-[60px] lg:h-[80px] text-white border-b px-4  border-red-600 flex items-center   justify-between   ">
            <div className="text-[18px] font-semibold cursor-pointer " onClick={() =>{router.push("/chat")}}>Chat</div>
          </div>
          <Users />
        </div>
        <div className=" w-full ">{children}</div>
      </div>
  );
}

export default RootLayout;
