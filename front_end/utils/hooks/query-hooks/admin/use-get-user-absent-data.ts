import { get_all_admin, get_user_absent_by_id } from "@/actions/admin/admin";
import { useQuery } from "@tanstack/react-query";

export  const fetch_user_absent_by_id = async(id : string) =>{
    const response = await get_user_absent_by_id(id);
    return {
        message : response.message,
        userAbsentRequest : JSON.parse(response?.userAbsentRequest as string)
    };
}

export const useGetUserAbsentById  = (id : string) =>{
    return useQuery({
        queryKey : ["get_user_absent_by_id"],
        queryFn : () => fetch_user_absent_by_id(id),
    })
}