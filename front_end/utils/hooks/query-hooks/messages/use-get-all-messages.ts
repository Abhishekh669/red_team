import { GetConversationAllMessages } from "@/actions/messages/message";
import { get_session, getSession } from "@/actions/session/session";
import { useQuery } from "@tanstack/react-query";

export  const fetch_messages = async({conversationId ,limit, lastID} : {
    conversationId : string,
    limit ?: number,
    lastID ?: string,

}) =>{
    const response = await GetConversationAllMessages({conversationId, limit, lastID});
    return {
        message : response.message,
        msgs : JSON.parse(response.msgs as string)
    };
}

export const useGetConversationAllMessages = ({conversationId ,limit, lastID} : {
    conversationId : string,
    limit ?: number,
    lastID ?: string,
}) =>{
    return useQuery({
        queryKey : ["get_messages"],
        queryFn : () => fetch_messages({conversationId, limit, lastID}),
    })
}