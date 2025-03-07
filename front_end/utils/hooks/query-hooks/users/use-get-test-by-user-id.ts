import { get_test_by_user_id } from "@/actions/users/user";
import { useQuery } from "@tanstack/react-query";

export  const fetch_test_by_user_id = async(id : string) =>{
    const response = await get_test_by_user_id(id);
    return {
        message : response.message,
        testData : JSON.parse(response.testData as string)
    };
}

export const useGetTestByUserId = (id : string) =>{
    return useQuery({
        queryKey : ["get_test_by_user_id"],
        queryFn : () => fetch_test_by_user_id(id),
    })
}