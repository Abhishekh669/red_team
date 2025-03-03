import {  get_all_absent_request} from "@/actions/admin/admin";
import { useQuery } from "@tanstack/react-query";

export  const fetch_all_absent_request = async() =>{
    const response = await get_all_absent_request();
    return {
        message : response.message,
        absentRequests : JSON.parse(response.absentRequests as string)
    };
}

export const useGetAllAbsentRequest = () =>{
    return useQuery({
        queryKey : ["get_all_absent_requests"],
        queryFn : () => fetch_all_absent_request(),
    })
}