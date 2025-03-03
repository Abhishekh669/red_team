import { getSession } from "@/actions/session/session";
import { get_all_users, get_user_by_id } from "@/actions/users/user";
import { useQuery } from "@tanstack/react-query";

export  const fetch_user = async(userId : string) =>{
    const response = await get_user_by_id(userId);
    return {
        message : response.message,
        user : JSON.parse(response.user as string)
    };
}

export const useGetUserById = (userId : string) =>{
    return useQuery({
        queryKey : ["get_user_by_id"],
        queryFn : () => fetch_user(userId),
    })
}