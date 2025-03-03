"use server";

import { backendUrl } from "@/lib";
import axios from 'axios'
import { get_cookies } from "@/lib/get-cookie";

interface ChatType {
    members: string[];
    name?: string;
    groupImage?: string;
  }
  

export const create_chat = async(values : ChatType) =>{
const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.post(`${backendUrl}/api/chat`,values,{
        withCredentials : true,
        headers : {
            Cookie : `__session=${session_cookie}`
        }
    })

    const data = await res.data;
    
    if (!data){
        return {
            error : "failed to create chat"
        }
    }

    return {
        message : "successfully created chat",
        chat : JSON.stringify(data)
       
    }
    
  } catch (error) {
    return {
        error : error || "failed to create chat"
    }
    
  }

}

export const get_chat_by_id = async (id: string) => {
  if (!id) {
    return {
      error: "invalid id",
    };
  }
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/chat/${id}`, {
      method: "GET",
      credentials: "include", // Ensure cookies are included in the request
      headers: {
        Cookie: `__session=${session_cookie}`,
      },
    });

    if (!res.ok){
        return {error : "failed to get the response"}
    }
    const data = await res.json() ;

    if(!data){
        return {error : "failed to get the data"}
    }

    return {
        message : "successfully fetched conversation",
        chat : JSON.stringify(data)
    }
    
  } catch (error) {
    return {
      error: error || "failed to fetch the chat",
    };
  }
};
