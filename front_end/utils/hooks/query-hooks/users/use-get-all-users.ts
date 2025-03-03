import { getSession } from "@/actions/session/session";
import { get_all_users } from "@/actions/users/user";
import { useQuery } from "@tanstack/react-query";

export  const fetch_users = async() =>{
    const response = await get_all_users();
    return {
        message : response.message,
        users : JSON.parse(response.users as string)
    };
}

export const useGetUsers = () =>{
    return useQuery({
        queryKey : ["get_users"],
        queryFn : () => fetch_users(),
    })
}