"use client"
import { useSessionStore } from '@/utils/store/use-session-store';
import { useSocketIOStore } from '@/utils/store/use-socket-io'
import React, { useEffect } from 'react'

function layout({children} : {children : React.ReactNode}) {
    const {user} = useSessionStore();
    
    const {connectSocket, disconnectSocket, selectedChat} = useSocketIOStore();
    useEffect(()=>{
      if(!user)return;
        connectSocket();
        return () =>{
          disconnectSocket();
        }
    },[user])
  return (
    <div className='w-full h-full'>
      {children}
    </div>
  )
}

export default layout
