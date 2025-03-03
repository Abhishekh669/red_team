import {  getSession } from "@/actions/session/session";
import { useQuery } from "@tanstack/react-query";

export  const fetch_session = async() =>{
    const response = await getSession();
    return {
        message : response.message,
        user : JSON.parse(response.user as string)
    };
}

export const useGetSession = () =>{
    return useQuery({
        queryKey : ["get_session"],
        queryFn : () => fetch_session(),
    })
}