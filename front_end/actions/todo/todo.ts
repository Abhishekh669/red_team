'use server'

import { backendUrl } from "@/lib";
import { get_cookies } from "@/lib/get-cookie";
import axios from "axios";

interface CreateTodoType{
    title : string,
    description : string,
    tag : "HIGH" | "LOW" | "MEDIUM",
    state : "PENDING" | "ONGOING" | "DONE"
}


export const get_user_all_todos = async() =>{
    const session_cookie = await get_cookies("__session");
      if (!session_cookie) {
        return {
          error: "user not authenticated",
        };
      }

    try {
        const res = await axios.get(`${backendUrl}/api/todo/all`,{
            withCredentials: true,
            headers: {
              Cookie: `__session=${session_cookie}`,
            },
        })
        console.log("this ish te response : ",res)
        if (res.statusText !== "OK"){
            return {
              error : "failed to get resposne "
            }
          }
          const data = await res.data || [];
          
          return { message: "Successfully got user todos", todos : JSON.stringify(data)};

    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data || "Unknown Axios error" };
          }
          return { error: "An unexpected error occurred" };
        
    }
}


export const CreateTodo = async(values : CreateTodoType) =>{
    const session_cookie = await get_cookies("__session");
      if (!session_cookie) {
        return {
          error: "user not authenticated",
        };
      }

    try {
        const res = await axios.post(`${backendUrl}/api/todo/create`,values,{
            withCredentials: true,
            headers: {
              Cookie: `__session=${session_cookie}`,
            },
        })
        if (res.statusText !== "OK"){
            return {
              error : "failed to update  test score"
            }
          }
          const data = await res.data;
          if(!data){
            return {
              error : "failed to update test score"
            }
          }
          return { message: "Successfully updated test score", status : data};

    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data || "Unknown Axios error" };
          }
          return { error: "An unexpected error occurred" };
        
    }


}