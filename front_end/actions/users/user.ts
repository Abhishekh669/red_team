"use server";

import { backendUrl } from "@/lib";
import { get_cookies } from "@/lib/get-cookie";
import axios from "axios";


export const get_test_by_user_id= async () => {
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return { error: "user not authenticated" }; // Return a response with an error message
  }

  try {
    const res = await axios.get(`${backendUrl}/api/user/get/test`,{
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie}`,
      },
    });

    if (res.statusText !== "OK"){
      return {
        error : "failed to get  test score"
      }
    }
    const data = await res.data;
   
   
    return { message: "Successfully got  test score", testData : JSON.stringify(data)};
  } catch (error  : unknown) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data || "Unknown Axios error" };
    }
    return { error: "An unexpected error occurred" };
  }
};


export const get_all_users = async () => {
  const backendUrl = process.env.BACKEND_URL!;
  const sessionCookie = await get_cookies("__session");
  // Corrected typo

  if (!sessionCookie) {
    return { error: "user not authenticated" }; // Return a response with an error message
  }

  try {
    const res = await fetch(`${backendUrl}/api/user/all`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `__session=${sessionCookie}`,
      },
    });

    const data = (await res.json()) || [];

    return {
      message: "got users",
      users: JSON.stringify(data),
    };
  } catch (error) {
    return {
      error: error || "something went wrong",
    };
  }
};


export const get_user_by_id = async(id : string) =>{

  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res  = await axios.get(`${backendUrl}/api/user/${id}`,{
      withCredentials : true,
      headers : {
        Cookie : `__session=${session_cookie}`
      }
    })
    const data = await res.data;

    if(!data){
      return {
        error : "failed to get user by id "
      }
    }

    return {
      message : "successfully got the user by id ",
      user : JSON.stringify(data)
    }
    
  } catch (error) {
    return {
      error : "failed to get the user"
    }
    
  }
}