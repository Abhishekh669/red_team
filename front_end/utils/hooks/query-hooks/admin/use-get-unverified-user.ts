import { get_unverified_users } from "@/actions/admin/admin";
import { useQuery } from "@tanstack/react-query";

export  const fetch_unverified_users = async() =>{
    const response = await get_unverified_users();
    return {
        message : response.message,
        users : JSON.parse(response.users as string)
    };
}

export const useGetUnverifiedUsers  = () =>{
    return useQuery({
        queryKey : ["get_unverified_users"],
        queryFn : () => fetch_unverified_users(),
    })
}