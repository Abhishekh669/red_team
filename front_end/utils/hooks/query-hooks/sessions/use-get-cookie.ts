import { get_cookie_for_user, get_session, getSession } from "@/actions/session/session";
import { useQuery } from "@tanstack/react-query";

export  const fetch_cookie = async(name : string) =>{
    const response = await get_cookie_for_user(name);
    return response
}

export const useGetCookie = (name : string) =>{
    return useQuery({
        queryKey : ["get_cookie"],
        queryFn : () => fetch_cookie(name),
    })
}