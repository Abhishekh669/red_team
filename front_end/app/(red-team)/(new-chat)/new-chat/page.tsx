"use client"
import React, { useEffect } from 'react'
import { useSocketIOStore } from '@/utils/store/use-socket-io'
import Sidebar from '@/components/chat/Sidebar';
import NoChatSelected from '@/components/chat/NoChatSelected';
import ChatContainer from '@/components/chat/ChatContainer';
import { useChatStore } from '@/utils/store/use-chat-store';

function NewChat() {
  const {selectedChat, setSelectedChat} = useSocketIOStore();
  const {conversations} = useChatStore();
  useEffect(()=>{
    if(conversations.length>0){
      setSelectedChat(conversations[0]._id)
    }
  },[conversations])
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
