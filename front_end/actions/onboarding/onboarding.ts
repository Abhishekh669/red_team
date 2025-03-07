'use server'

import { backendUrl } from "@/lib";
import { get_cookies } from "@/lib/get-cookie";
import axios from "axios";


interface OnboardingType{
    codeName : string,
    phoneNumber : string,
    address : string,
    age : number,
    qualification : string,
    field : string,
    userId : string
}

export const onboard_user = async(values : OnboardingType) =>{
    const session_cookie = await get_cookies("__session");
      if (!session_cookie) {
        return {
          error: "user not authenticated",
        };
      }

    try {
        const res = await axios.post(`${backendUrl}/api/user/onboard`,values,{
            withCredentials : true,
            headers : {
                Cookie : `__session=${session_cookie}`
            }
        })

        const data = await res.data;
        console.log("this is the user after onbaording : ",data)
        if(!data){
            return {
                error : "failed to onboard the user"
            }
        }
        return {
            message : "successfully onboarded user",
            onboarded_user : JSON.stringify(data)
        }
    } catch (error) {
        return {error : "failed to onbaord the user "}
        
    }
    

}