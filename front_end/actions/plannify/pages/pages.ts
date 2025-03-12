"use server"

import { backendUrl } from "@/lib";
import { get_cookies } from "@/lib/get-cookie";
import axios from "axios";

interface PageModelType{
    title : string,
    description : string,
    type : string
}


export const getUserAllPages = async() =>{
  const session_cookie = await get_cookies("__session");
    if (!session_cookie) {
      return {
        error: "user not authenticated",
      };
    }

    console.log(" iam here man")

  try {
      const res = await axios.get(`${backendUrl}/api/planify/pages/user/all`,{
          withCredentials: true,
          headers: {
            Cookie: `__session=${session_cookie}`,
          },
      })
      console.log("thisi shte repsone in pages  : ",res)
      if (res.statusText !== "OK"){
          return {
            error : "failed to get resposne "
          }
        }
        const data = await res.data || [];
        
        return { message: "Successfully got user pages", pages : JSON.stringify(data)};

  } catch (error) {
      if (axios.isAxiosError(error)) {
          return { error: error.response?.data || "Unknown Axios error" };
        }
        return { error: "An unexpected error occurred" };
      
  }
}





export const getPageById = async(id  : string) =>{
    const session_cookie = await get_cookies("__session");
      if (!session_cookie) {
        return {
          error: "user not authenticated",
        };
      }

    try {
        const res = await axios.get(`${backendUrl}/api/planify/pages/${id}`,{
            withCredentials: true,
            headers: {
              Cookie: `__session=${session_cookie}`,
            },
        })
        if (res.statusText !== "OK"){
            return {
              error : "failed to get  page"
            }
          }
          const data = await res.data;
          if(!data){
            return {
              error : "failed to get page"
            }
          }
          return { message: "Successfully got page data", pageData : JSON.stringify(data)};

    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data || "Unknown Axios error" };
          }
          return { error: "An unexpected error occurred" };
        
    }


}

export const CreatePage = async(values : PageModelType) =>{
    const session_cookie = await get_cookies("__session");
      if (!session_cookie) {
        return {
          error: "user not authenticated",
        };
      }

    try {
        const res = await axios.post(`${backendUrl}/api/planify/pages/create`,values,{
            withCredentials: true,
            headers: {
              Cookie: `__session=${session_cookie}`,
            },
        })
        if (res.statusText !== "OK"){
            return {
              error : "failed to create  page"
            }
          }
          const data = await res.data;
          if(!data){
            return {
              error : "failed to create page"
            }
          }
          return { message: "Successfully created new page", pageData : JSON.stringify(data)};

    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data || "Unknown Axios error" };
          }
          return { error: "An unexpected error occurred" };
        
    }


}