'use server'

import { backendUrl } from "@/lib";
import { get_cookies } from "@/lib/get-cookie";
import axios from "axios";

interface MessageType{
    conversationId : string,
    body ?: string,
    sender : string,
    receiver : string,
    image ?: string
}


interface GetMessagesType{
  conversationId : string, 
  limit ?: number,
  lastID ?: string,
}
export const GetConversationAllMessages = async({conversationId, limit, lastID} : GetMessagesType) =>{
  const session_cookie = await get_cookies("__session");
      if (!session_cookie) {
        return {
          error: "user not authenticated",
        };
      }

    try {
      const params: Record<string, any> = {
        limit: limit || 10, // Use the provided limit or default to 10
    };

    // Only add lastID to params if it is defined
    if (lastID) {
        params.lastID = lastID;
    }
      const res = await axios.get(`${backendUrl}/api/message/all/${conversationId}`,{
        withCredentials : true,
        headers : {
            Cookie : `__session=${session_cookie}`
        },
        params : params
    })

    if (res.statusText != "OK"){
      return {
        error : "failed to get messages",
      }
    }

    const data = await res.data;

    return {
      message : "successfully got messages",
      msgs : JSON.stringify(data)
    }
      
    } catch (error) {
      return {
        error : "failed to get messages"
      }
      
    }


}

export const create_message = async(values : MessageType) =>{
    const session_cookie = await get_cookies("__session");
      if (!session_cookie) {
        return {
          error: "user not authenticated",
        };
      }

      try {
        const res = await axios.post(`${backendUrl}/api/message`,values,{
            withCredentials : true,
            headers : {
                Cookie : `__session=${session_cookie}`
            }
        })

        const data = await res.data;
    
    if (!data){
        return {
            error : "failed to create message"
        }
    }

    return {
        message : "successfully created message",
        msg : JSON.stringify(data)
       
    }
        
      } catch (error) {
        return {
            error : "failed to send message"
        }
        
      }
    
}