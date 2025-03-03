"use client";
import { UserType } from "@/components/authorize/authorize-user";
import Header from "@/components/chat/Header";
import { useGetChatById } from "@/utils/hooks/query-hooks/chat/use-get-chat-by-id";
import { useGetSession } from "@/utils/hooks/query-hooks/sessions/use-get-sessions";
import { useChatId } from "@/utils/use-chat-id";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateMessage } from "@/utils/hooks/mutate-hooks/messages/use-create-message";
import { useGetConversationAllMessages } from "@/utils/hooks/query-hooks/messages/use-get-all-messages";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import MessageBox from "@/components/messages/message";
import { cn } from "@/lib/utils";
import { useWebSocketStore } from "@/utils/store/use-websocket-store";
import { MessageTypeFromServer } from "@/types";
import { Loader } from "@/components/ui/Loader";

const MESSAGES_PER_PAGE = 10;

function ChatIdPage() {
  const chatId = useChatId();
const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageTypeFromServer[]>([])
  const [seenMessageId, setSeenMessageId] = useState<string | null>(null);
  const [items, setItems] = useState(Array.from({ length: 30 })); // Dummy data for InfiniteScroll
  const { data: session, isLoading: session_loading } = useGetSession();
  const { data: conversationInfo, isLoading: conversationInfo_loading } = useGetChatById(chatId);
  const { mutate: create_message } = useCreateMessage();
  const {socketMessages, initializeWebSocket, setSelectedConversation }  = useWebSocketStore();
  
  
  
  
  const { data: all_messages, isLoading: messages_loading } =useGetConversationAllMessages({conversationId: chatId,limit: MESSAGES_PER_PAGE,lastID: ""});
  
  const otherUser = useMemo(() => {
    if (conversationInfo_loading || session_loading) return;
    const user = conversationInfo?.chat?.members.filter(
      (u: UserType) => u._id !== session?.user?._id
    );
    return user[0];
  }, [conversationInfo_loading, session_loading,session?.user?._id, conversationInfo?.chat]);
  
  console.log("this is the socket message okie  ", socketMessages)
  useEffect(()=>{
    if(chatId){
      setSelectedConversation(chatId)
    }

  },[chatId, setSelectedConversation])

  useEffect(()=>{
    if(session_loading)return
    initializeWebSocket(session?.user._id, chatId)
  },[chatId, session?.user, session_loading, initializeWebSocket])

    useEffect(()=>{
      if(socketMessages && messages ){
        setMessages((prev) => [...prev, socketMessages])
      }
    },[socketMessages, messages])

    useEffect(() => {
      if (!messages_loading && all_messages?.msgs?.messages) {
        setMessages([...all_messages?.msgs?.messages]);
      }
    }, [messages_loading, all_messages?.msgs]);

   

  // Function to fetch more data
  const fetchMoreData = () => {
    // Simulate an async API call with a timeout
    setTimeout(() => {
      setItems((prevItems) => prevItems.concat(Array.from({ length: 20 })));
    }, 1500);
  };

  const handle_send_message = () => {
    if (message.length === 0 || session_loading || !otherUser) return;
    const values = {
      conversationId: chatId,
      body: message,
      sender: session?.user?._id as string,
      receiver : otherUser?._id as string,
      image: "no image for now",
    };

    create_message(values, {
      onSuccess: (res) => {
        if (res.message && res.msg) {
          // const data = JSON.parse(res.msg)
          // sendMessage(data)
          
          setMessage("");
        } else {
          toast.error(res.error);
        }
      },
      onError: () => {
        toast.error("Failed to send message");
      },
    });
  };

  if(messages_loading)return <Loader />

  return (
    <div className="w-full  flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="">
        <Header user={otherUser} />
      </div>

      {/* Scrollable Messages Section */}
      <div
        id="scrollableDiv"
        className="text-white w-full h-[calc(100vh-160px)] lg:h-[calc(100vh-180px)] overflow-y-scroll"
      >
        {
          messages && messages.length !==0  &&  (
            <InfiniteScroll
          dataLength={items.length} // Current length of the data
          next={fetchMoreData} // Function to load more data
          hasMore={false} // Always true for infinite loading
          loader={messages?.length > 0 && <h4 className="text-white">Loading...</h4>} // Loading spinner or message
          scrollableTarget="scrollableDiv" // ID of the scrollable container
            className="flex flex-col gap-y-4 px-4 py-2"

        >
           {messages &&  messages.length !== 0 && 
            messages?.map((msg: MessageTypeFromServer) => (
              <div
                key={msg?._id}
                className={cn(
                  "flex justify-start",
                  (msg?.sender?._id === session?.user?._id) ?  "justify-end" : ""
                )}
              >
                <MessageBox
                  message={msg}
                  session={session?.user}
                  seenMessageId={seenMessageId}
                  setSeenMessageId={setSeenMessageId}
                />
              </div>
            ))}
        </InfiniteScroll>
          )
        }
      </div>

      {/* Input Section */}
      <div className="flex gap-x-3 px-4 lg:px-8 mb-2">
        <Input
          className="text-white"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handle_send_message();
            }
          }}
          placeholder="message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={handle_send_message}>Send</Button>
      </div>
    </div>
  );
}

export default ChatIdPage;