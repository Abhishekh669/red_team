import { getPageById } from "@/actions/plannify/pages/pages";
import { useQuery } from "@tanstack/react-query";

export  const fetch_page_by_id= async(id : string) =>{
    const response = await getPageById(id);
    return {
        message : response.message,
        pageData : JSON.parse(response.pageData as string)
    };
}

export const useGetPageById= (id : string) =>{
    return useQuery({
        queryKey : ["get_page_by_id"],
        queryFn : () => fetch_page_by_id(id),
    })
}