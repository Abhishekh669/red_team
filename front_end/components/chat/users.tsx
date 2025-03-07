"use client"
import { UserType } from '@/components/authorize/authorize-user';
import UserCard from '@/components/chat/user-card';
import { Loader } from '@/components/ui/Loader';
import { useCreateChat } from '@/utils/hooks/mutate-hooks/chat/use-create-chat';
import { useGetSession } from '@/utils/hooks/query-hooks/sessions/use-get-sessions'
import { useGetUsers } from '@/utils/hooks/query-hooks/users/use-get-all-users';
import { useSocketIOStore } from '@/utils/store/use-socket-io';
import { useRouter } from 'next/navigation';
import React  from 'react'


function Users() {

  
  const {data : session , isLoading : session_loading} = useGetSession();
  const {data : users, isLoading : user_loading} = useGetUsers();
  const {mutate : create_chat} = useCreateChat();
  const router = useRouter();
  const {setSelectedChat} = useSocketIOStore()
  
   
   
  if(session_loading || user_loading)return <Loader />
  const handle_create_conversation = (userId : string) =>{
    if(userId == session?.user?._id)return ;
    const values = {
      members : [userId]
    }
    create_chat(values,{
      onSuccess : (res) =>{
        if(res.chat && res.message){
          const data = JSON.parse(res.chat)
          setSelectedChat(data._id)
          router.push(`/chat/${data._id}`)
        }
      }
    })


  }
  return (
    <div className='w-full h-full cursor-pointer flex flex-col gap-y-1 '>
      {users && users.users.map((user : UserType) =>(
       <div key={user?._id} onClick={() =>{
        handle_create_conversation(user?._id)
       }}
        className='  bg-red-600 w-full px-0'
       >
        <UserCard key={user?._id} user={user}/>
       </div>
      ))}
    </div>
  )
}

export default Users
