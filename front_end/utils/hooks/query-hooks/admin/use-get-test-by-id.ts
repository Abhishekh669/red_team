import { get_test_by_id } from "@/actions/admin/admin";
import { useQuery } from "@tanstack/react-query";

export  const fetch_test_by_id = async(id : string) =>{
    const response = await get_test_by_id(id);
    return {
        message : response.message,
        testData : JSON.parse(response.testData as string)
    };
}

export const useGetTestById  = (id : string) =>{
    return useQuery({
        queryKey : ["get_test_by_id"],
        queryFn : () => fetch_test_by_id(id),
    })
}