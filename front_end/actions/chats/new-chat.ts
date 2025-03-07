'use server'

import { chatBackendUrl } from "@/lib";
import { get_cookies } from "@/lib/get-cookie";
import axios from "axios";

export const validate_session = async () =>{
    const chat_token= await get_cookies("chat_session");
    if(!chat_token){
        return {
            error : "user not authenticated"
        }
    }
    try {

        const res = await axios.get(`${chatBackendUrl}/api/chat/auth/validateToken`,{
            // withCredentials : true,
            headers: {
                Cookie: `chat_session=${chat_token}`,
              },
            
        })

        if(res.statusText !== "OK"){
            return {
                error : "failed to get response"
            }
        }
        const data = await res.data;
        if(!data){
            return {
                error : "failed to authenticate "
            }
        }
        return {
            message : data.message,
            status : data.authenticated,
        }
        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data || "Unknown Axios error" };
          }
          return { error: "An unexpected error occurred" };
        }
        
    }
