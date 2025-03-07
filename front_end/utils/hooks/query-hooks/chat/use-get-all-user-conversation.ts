import { get_all_user_conversations, get_chat_by_id } from "@/actions/chats/chat";
import { useQuery } from "@tanstack/react-query";

export  const fetch_all_user_conversations= async() =>{
    const response = await get_all_user_conversations();
    return {
        message : response.message,
        chats : JSON.parse(response.chats as string)
    };
}

export const useGetAllUserConversations= () =>{
    return useQuery({
        queryKey : ["get_all_user_conversations"],
        queryFn : () => fetch_all_user_conversations(),
    })
}