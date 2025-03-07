"use client";
import React, { useEffect, useMemo, useState } from "react";
import ChatMessages from "./ChatMessages";
import { useChatStore } from "@/utils/store/use-chat-store";
import { useSocketIOStore } from "@/utils/store/use-socket-io";
import { useSessionStore } from "@/utils/store/use-session-store";
import MessageInput from "./skeletons/MessageInput";
import ChatHeader from "./ChatHeader";
import { UserInMessageType } from "@/types";

function ChatContainer() {
  const { user } = useSessionStore();
  const { selectedChat, socket } = useSocketIOStore();
  const [limit, setLimit] = useState(20);
  const [lastID, setLastID] = useState("");
  const {
    messages,
    getMessages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    getChatByID,
    isChatInfoLoading,
    ChatInfo, 
    sendMessage,
  } = useChatStore();

  useEffect(() => {
    if (!selectedChat) return;
    const values = {
      conversationId: selectedChat,
      limit,
      lastID,
    };
    getMessages(values);
    getChatByID(selectedChat);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    selectedChat,
    getMessages,
    getChatByID,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  const otherUser = useMemo(() => {
    if (!user) return;
    return (
      ChatInfo &&
      ChatInfo?.members.filter((u: UserInMessageType) => u._id !== user?._id)[0]
    );
  }, [ChatInfo, user]);

  const onSendMessage = async (message: {
    text: string;
    image?: string | null;
  }) => {
    if (!selectedChat || !user) return;
    const values = {
      conversationId: selectedChat,
      text: message.text || "",
      senderId: user._id,
      receiverId: otherUser._id,
      image: message.image || "",
    };
    await sendMessage(values);

  };

  console.log("this ishte socket : ",socket)
  return (
    <div className="">
      <ChatHeader otherUser={otherUser} />
      <div className="">
        <div className="max-h-[80vh]">
          <ChatMessages
            messages={messages}
            isLoading={isMessagesLoading}
            currentUser={user}
          />
        </div>
        <MessageInput
          onSendMessage={onSendMessage}
          placeholder="type a message"
          disabled={isMessagesLoading}
        />
      </div>
    </div>
  );
}

export default ChatContainer;
