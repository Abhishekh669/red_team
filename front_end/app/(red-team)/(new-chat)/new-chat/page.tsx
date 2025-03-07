"use client"
import React from 'react'
import { useGetChatByToken } from '@/utils/hooks/query-hooks/chat/use-get-chat-session'
import { useSocketIOStore } from '@/utils/store/use-socket-io'
import Sidebar from '@/components/chat/Sidebar';
import NoChatSelected from '@/components/chat/NoChatSelected';
import ChatContainer from '@/components/chat/ChatContainer';

function NewChat() {
  const {selectedChat} = useSocketIOStore();
  return (
    <div className="flex h-[calc(100vh-70px)] lg:h-[calc(100vh-70px)]  max-w-screen w-screen  md:max-w-full md:w-full  bg-background text-foreground">
    <Sidebar
     
    />
      <main className="flex-1  flex flex-col  ">
        {!selectedChat ? <NoChatSelected /> : <ChatContainer />}
      </main> 
  </div>
  )
}

export default NewChat
