import {  get_all_test_data } from "@/actions/admin/admin";
import { useQuery } from "@tanstack/react-query";

export  const fetchAllTestData = async() =>{
    const response = await get_all_test_data();
    return {
        message : response.message,
        testData : JSON.parse(response.testData as string)
    }
}

export const useGetAllTestData  = () =>{
    return useQuery({
        queryKey : ["get_all_test_data"],
        queryFn : () => fetchAllTestData(),
    })
}