"use client"
import Users from '@/components/chat/users'
import useSidebar from '@/components/ui/sidebar'
import { Plus } from 'lucide-react'
import React  from 'react'


function Chat() {
  const {isMobile} = useSidebar()

  return (
    <div className='space-y-3 h-full text-white'>
      {
        isMobile  ? (<>
          
          <Users/>
        </>) : (<div className='w-full h-full flex justify-center items-center'>
          <div className='flex flex-col items-center text-[18px] text-red-600'>
            <Plus />
            Start or create new conversation
          </div>
        </div>)
      }
    </div>
  )
}

export default Chat
