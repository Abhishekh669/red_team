import { get_chat_by_id } from "@/actions/chats/chat";
import { useQuery } from "@tanstack/react-query";

export  const fetch_chat_by_id = async(id : string) =>{
    const response = await get_chat_by_id(id);
    return {
        message : response.message,
        chat : JSON.parse(response.chat as string)
    };
}

export const useGetChatById= (id : string) =>{
    return useQuery({
        queryKey : ["get_chat_by_id"],
        queryFn : () => fetch_chat_by_id(id),
    })
}