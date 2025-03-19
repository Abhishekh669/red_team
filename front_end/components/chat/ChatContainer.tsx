"use client";
import React, { useEffect, useMemo, useState } from "react";
import ChatMessages from "./ChatMessages";
import { useChatStore } from "@/utils/store/use-chat-store";
import { useSocketIOStore } from "@/utils/store/use-socket-io";
import { useSessionStore } from "@/utils/store/use-session-store";
import MessageInput from "./skeletons/MessageInput";
import ChatHeader from "./ChatHeader";
import { MessageTypeFromServer, UserForConversation, UserInMessageType } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUploadThing } from "@/utils/uploadthing";
import { useEdgeStore } from "@/utils/edgestore";
import { Cross, X } from "lucide-react";
import { Button } from "../ui/button";

function ChatContainer() {
  const { user } = useSessionStore();
  const { selectedChat,  } = useSocketIOStore();
  const { edgestore } = useEdgeStore();
  const [limit, setLimit] = useState(20);
  const [lastID, setLastID] = useState("");
  const { replyTo, resetReplyTo, editingData } = useChatStore();

  const { startUpload } = useUploadThing("imageUploader");
  const {
    messages,
    getMessages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    getChatByID,
    ChatInfo,
    sendMessage,
    conversations,
    editMessage,
    resetEditData
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
    if (!user || ChatInfo?.isGroup) return;
    return (
      ChatInfo &&
      ChatInfo?.members.filter((u: UserInMessageType) => u._id !== user?._id)[0]
    );
  }, [ChatInfo, user]);

  const onSendMessage = async (message: {
    text: string;
    imageFile?: File | null;
  }) => {
    if (!selectedChat || !user) return;
  if(editingData){
    const currentConversation = conversations.filter((conversation)=> conversation._id === selectedChat)[0];
    const editPayload = {
      _id : editingData._id,
      senderId : editingData.sender._id,
      text : message.text,
      conversationId : selectedChat,
      otherMembers : currentConversation.isGroup ? currentConversation.members.filter((u : UserForConversation)=> u._id != editingData.sender._id) : [editingData.receiver._id]
    }
    console.log("this is hte eidt pagyloyad : ",editPayload)
   await  editMessage(editPayload);
   resetEditData();
  } else{
    let picUrl = "";
    console.log(message.imageFile);
    if (message.imageFile) {
      const res = await edgestore.publicFiles.upload({
        file: message.imageFile,
        onProgressChange: (progress) => {
          console.log(progress);
        },
      });
      picUrl = res.url;
    }

    const values = replyTo
      ? {
          conversationId: selectedChat,
          text: message.text || "",
          senderId: user._id,
          receiverId: otherUser?._id || "",
          image: picUrl || "",
          replyTo: {
            _id: replyTo._id,
            text: replyTo.text,
            image: replyTo.image,
            sender: {
              _id: replyTo.sender._id,
              name: replyTo.sender.name,
              image: replyTo.sender.image,
            },
          },
        }
      : {
          conversationId: selectedChat,
          text: message.text || "",
          senderId: user._id,
          receiverId: otherUser?._id || "",
          image: picUrl || "",
        };
    await sendMessage(values);
  }
    getMessages({ conversationId: selectedChat });
  };

  console.log("thsi s editing data : ",editingData);

  return (
    <div className="">
      {ChatInfo && (
        <>
          {ChatInfo.isGroup ? (
            <>
              <header className="bg-primary text-primary-foreground p-4 flex gap-x-2 items-center text-red-600">
                <Avatar className="">
                  <AvatarImage src={ChatInfo.image} alt={ChatInfo.name} />
                  <AvatarFallback>
                    {ChatInfo.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <h1 className="text-2xl font-bold">{ChatInfo.name}</h1>
              </header>
            </>
          ) : (
            <>
              <ChatHeader otherUser={otherUser} />
            </>
          )}
        </>
      )}
      <div className="">
        <div className="max-h-[78vh]">
          <ChatMessages
            messages={messages}
            isLoading={isMessagesLoading}
            currentUser={user}
          />
        </div>
        <div className="mx-3 relative">
          <MessageInput
            onSendMessage={onSendMessage}
            placeholder="type a message"
            disabled={isMessagesLoading}
          />
          <div className="absolute -top-[2.3rem] mx- 2 w-full">
          {" "}
          {replyTo && (
            <div className="bg-slate-100  rounded-md  w-full  text-black">
              <div className="flex justify-between items-center px-2">
                <div className="max-w-[400px] truncate">
                  Replying to{" "}
                  <span className="font-bold">
                    {replyTo.sender.name}
                    {replyTo.sender._id === user?._id ? "(Yourself)" : ""}
                  </span>{" "}
                  : {replyTo.text}
                </div>
                <Button
                  variant={"outline"}
                  className="border-none bg-transparent"
                  onClick={() => resetReplyTo()}
                >
                  <X />
                </Button>
              </div>
            </div>
          )}
          {
            editingData && (
              <div className="bg-slate-100  rounded-md  w-full  text-black">
              <div className="flex justify-between items-center px-2">
                <div className="max-w-[400px] truncate">
                  Edit Message :  {" "}
                  <span className="font-bold">
                    {editingData.sender.name}
                    {editingData.sender._id === user?._id ? "(Yourself)" : ""}
                  </span>{" "}
                  : {editingData.text}
                </div>
                <Button
                  variant={"outline"}
                  className="border-none bg-transparent"
                  onClick={() => resetEditData()}
                >
                  <X />
                </Button>
              </div>
            </div>
            )
          }
        </div>
        </div>
        
      </div>
    </div>
  );
}

export default ChatContainer;
