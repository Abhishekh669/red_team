"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { MessageTypeFromServer } from "@/types";
import { UserType } from "../authorize/authorize-user";
import InfiniteScroll from "react-infinite-scroll-component";
import { cn } from "@/lib/utils";
import MessageBox from "../messages/message";
import { useSessionStore } from "@/utils/store/use-session-store";
import { useChatStore } from "@/utils/store/use-chat-store";

interface ChatMessagesProps {
  messages: MessageTypeFromServer[];
  isLoading?: boolean;
  currentUser?: UserType | null;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading = false,
  currentUser,
}) => {
  const {user} = useSessionStore();
  const {onReply,onEdit, onDelete } = useChatStore();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [seenMessageId, setSeenMessageId] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);


  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

 const handleReply = (message : MessageTypeFromServer) =>{
  console.log("this is handle reply : ", message)
  if(message){
    onReply(message)
  }
  
}


const handleEdit = (message : MessageTypeFromServer) =>{
    if(message.text){
      onEdit(message)
    }

  }

  const handleDelete = (messageId : string) =>{
    if(messageId){
      onDelete(messageId)
    }

  }

  const handleAddReaction = (messageId : string , emoji : string)=>{

  }

  const handleRemoveReaction = (messageId : string, emoji : string)=>{

  }

  const getFormattedReactions = (message : MessageTypeFromServer) =>{
    return message?.reactions?.map((reaction) =>({emoji : reaction.emoji, count : reaction.users.length, userReacted : reaction.users.includes(user?._id!)}))
    
  }

  

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      ref={messagesContainerRef}
      id="scrollableDiv"
      className="text-white w-full h-[calc(100vh-200px)] lg:h-[calc(100vh-180px)] overflow-y-scroll"
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
                msg?.sender?._id === currentUser?._id ? "justify-end" : ""
              )}
              onMouseEnter={() => setShowOptions(true)}
              onMouseLeave={() => setShowOptions(false)}
            >
              <div className="">
                <MessageBox
                  message={msg}
                  session={currentUser || null}
                  seenMessageId={seenMessageId}
                  setSeenMessageId={setSeenMessageId}
                  currentUser={msg.sender._id === user?._id}
                  replyTo={msg.replyTo}
                  reactions={getFormattedReactions(msg)}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddReaction={handleAddReaction}
                  onRemoveReaction={handleRemoveReaction}
                />
                {/* <Options /> */}
              </div>
            </div>
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default ChatMessages;
