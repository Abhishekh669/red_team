import { validate_session } from "@/actions/chats/new-chat";
import { useQuery } from "@tanstack/react-query";

export  const fetch_chat_token = async() =>{
    const response = await validate_session();
    return response;
}

export const useGetChatByToken= () =>{
    return useQuery({
        queryKey : ["get_chat_token"],
        queryFn : () => fetch_chat_token(),
    })
}