import { get_user_all_absent_results } from "@/actions/absent/absent";
import { useQuery } from "@tanstack/react-query";

export  const fetch_user_all_absent_request = async() =>{
    const response = await get_user_all_absent_results();
    return {
        message : response.message,
        absentResults : JSON.parse(response.absentResults as string)
    };
}

export const useGetUserAllAbsentRequest  = () =>{
    return useQuery({
        queryKey : ["get_user_all_absent_request"],
        queryFn : () => fetch_user_all_absent_request(),
    })
}