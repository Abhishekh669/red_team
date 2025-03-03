'use server'

import { decodeType } from "@/app/api/auth/google/callback/route";
import { get_cookies } from "@/lib/get-cookie";
import jwt from "jsonwebtoken";




export async function getSession() {
  const backendUrl = process.env.BACKEND_URL!;
  const sessionCookie = await get_cookies("__session");
  if (!sessionCookie) {
   return {error : "user not authenticated"} // Return a response with an error message
  }

  

  try {
    const res = await fetch(`${backendUrl}/api/auth/session`, {
      method: "GET",
      credentials: "include", // Ensure cookies are included in the request
      headers: {
        Cookie : `__session=${sessionCookie}`
      },
    });


    if (!res.ok) {
      return {error : "failed to get the response"}
    }

    const session = await res.json(); // Await and parse the response body

    if (!session) {
        return {
            error : "failed to get session"
        }
    }

    return {
        message : "successfully created session",
        user : JSON.stringify(session.user)
        } // Return session data if successful
  } catch (error) {
    return {
        error : error || "something went wrong"
    }
  }
}

export const get_session  = async() =>{
  const token = await get_cookies("user_session")
  if(!token){
    return {error : "no token found"};
  }
  
  const user_data = await jwt.verify(
    token,
    process.env.JWT_SECRET!
  );

  if(!user_data){
    return {error  : "not token found"}
  }

  return {

    message: "found user data",
    user : JSON.stringify(user_data as decodeType)
    
  }
}


export const get_cookie_for_user = async(name : string) =>{
  if(!name)return {error : "name not given"}
  try {
    const session = await get_cookies(name);
    if(!session)return {error : "session not avilable"}
    return {
      message  :"successfully got session",
      session
    }
  } catch (error) {
    return {
      error : "failed to get error"
    }
    
  }
}
