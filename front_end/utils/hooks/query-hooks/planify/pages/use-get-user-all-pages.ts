import { getUserAllPages } from "@/actions/plannify/pages/pages";
import { useQuery } from "@tanstack/react-query";

export  const fetch_user_all_pages= async () =>{
    const response = await getUserAllPages();
    console.log("this ishte repsone ion hook : ",response)
    return {
        message : response.message,
        pages : JSON.parse(response.pages as string)
    };
}

export const useGetUserAllPages= () =>{
    return useQuery({
        queryKey : ["get_user_all_pages"],
        queryFn : () => fetch_user_all_pages(),
    })
}