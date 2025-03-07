"use client"
import Conversations from '@/components/chat/conversations'
import useSidebar from '@/components/ui/sidebar'
import { useGetAllUserConversations } from '@/utils/hooks/query-hooks/chat/use-get-all-user-conversation'
import { Plus } from 'lucide-react'
import React  from 'react'


function Chat() {
  const {isMobile} = useSidebar()

  return (
    <div className='space-y-3 h-full text-white'>
      {
        isMobile  ? (<>
          
          {/* <Users/> */}
          <Conversations />
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
