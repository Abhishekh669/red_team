"use client"
import { useGetAllUserConversations } from '@/utils/hooks/query-hooks/chat/use-get-all-user-conversation'
import { useSessionStore } from '@/utils/store/use-session-store';
import React from 'react'
import { Loader } from '../ui/Loader';
import { ConversationFromServer, UserInMessageType } from '@/types';
function Conversations() {
    const {user} = useSessionStore();
    const {data : allConversations, isLoading} = useGetAllUserConversations();
    const getOtherUser = (members : UserInMessageType[]) =>{
        const users = members.filter((m)=> m._id != user?._id);
        return users[0].name;
    }
    
 if(isLoading) return <Loader />
  return (
    <div>
        {allConversations?.chats && allConversations?.chats.map((c : ConversationFromServer)=>(
            <div
                key={c._id}
                className='border border-white  text-white bg-blue-400 p-4'
            >
                {c?.isGroup ?   (<>
                    {c.name}
                </>) : (<>
                    {getOtherUser(c.members)}
                </>)}                

            </div>
        ))}
      
    </div>
  )
}

export default Conversations
