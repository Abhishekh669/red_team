"use client"
import React, { useEffect, useMemo, useState } from "react";
import { useGetChatById } from "@/utils/hooks/query-hooks/chat/use-get-chat-by-id";
import { useGetSession } from "@/utils/hooks/query-hooks/sessions/use-get-sessions";
import { useChatId } from "@/utils/use-chat-id";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateMessage } from "@/utils/hooks/mutate-hooks/messages/use-create-message";
import { useGetConversationAllMessages } from "@/utils/hooks/query-hooks/messages/use-get-all-messages";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import MessageBox from "@/components/messages/message";
import { cn } from "@/lib/utils";
import { useSocketIOStore } from "@/utils/store/use-socket-io";
import { useSessionStore } from "@/utils/store/use-session-store";
import { Loader } from "@/components/ui/Loader";
import Header from "@/components/chat/Header";
import { MessageTypeFromServer } from "@/types";
import { UserType } from "@/components/authorize/authorize-user";
import { Socket } from "socket.io-client";

const MESSAGES_PER_PAGE = 10;

function ChatIdPage() {
  const chatId = useChatId();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageTypeFromServer[]>([]);
  const [seenMessageId, setSeenMessageId] = useState<string | null>(null);
  const { data: session, isLoading: session_loading } = useGetSession();
  const { data: conversationInfo, isLoading: conversationInfo_loading } =
    useGetChatById(chatId);
  const { mutate: create_message } = useCreateMessage();
  const { data: all_messages, isLoading: messages_loading } =
    useGetConversationAllMessages({
      conversationId: chatId,
      limit: MESSAGES_PER_PAGE,
      lastID: "",
    });
  const { user } = useSessionStore();
  const {
    setSelectedChat,
    selectedChat,
    socketMessage,
    subscribeToMessages,
    unsubscribeToMessages,
    setSocketMessage,
  } = useSocketIOStore();

  // Subscribe to messages when the component mounts
  useEffect(() => {
    setSelectedChat(chatId);
    subscribeToMessages();
    return () => unsubscribeToMessages();
  }, [chatId, selectedChat, setSelectedChat, subscribeToMessages, unsubscribeToMessages]);

  // Update messages when a new socketMessage is received
  useEffect(() => {
    if (socketMessage) {
      if(socketMessage.conversationId !== chatId)return;
      setMessages((prevMessages) => [ ...prevMessages, socketMessage]);
      setSocketMessage();
    }
  
  }, [socketMessage, chatId]); // Remove `messages` from the dependency array

  // Fetch initial messages
  

  // Update messages when initial messages are fetched
  useEffect(() => {
    if (!messages_loading && all_messages?.msgs?.messages) {
      setMessages(all_messages.msgs.messages);
    }
  }, [messages_loading, all_messages?.msgs]);

  // Get the other user in the conversation
  const otherUser = useMemo(() => {
    if (conversationInfo_loading || session_loading) return;
    return conversationInfo?.chat?.members.find(
      (u: UserType) => u._id !== session?.user?._id
    );
  }, [conversationInfo_loading, session_loading, session?.user?._id, conversationInfo?.chat]);

  // Handle sending a message
  const handle_send_message = () => {
    if (message.length === 0 || session_loading || !otherUser) return;
    const values = {
      conversationId: chatId,
      text: message,
      senderId: session?.user?._id as string,
      receiverId: otherUser?._id as string,
      image: "",
    };

    create_message(values, {
      onSuccess: (res) => {
        if (res.message && res.msg) {
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

  if (messages_loading) return <Loader />;

  return (
    <div className="w-full flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="">
        <Header user={otherUser} />
      </div>

      {/* Scrollable Messages Section */}
      <div
        id="scrollableDiv"
        className="text-white w-full h-[calc(100vh-160px)] lg:h-[calc(100vh-180px)] overflow-y-scroll"
      >
        {messages && messages.length !== 0 && (
          <InfiniteScroll
            dataLength={messages.length}
            next={() => {}}
            hasMore={false}
            loader={<h4 className="text-white">Loading...</h4>}
            scrollableTarget="scrollableDiv"
            className="flex flex-col gap-y-4 px-4 py-2"
          >
            {messages.map((msg: MessageTypeFromServer) => (
              <div
                key={msg?._id}
                className={cn(
                  "flex justify-start",
                  msg?.sender?._id === session?.user?._id ? "justify-end" : ""
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
        )}
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