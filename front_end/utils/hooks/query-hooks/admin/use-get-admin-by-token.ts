import { get_admin_data_from_token} from "@/actions/admin/admin";
import { useQuery } from "@tanstack/react-query";

export  const fetch_admin_by_token = async() =>{
    const response = await get_admin_data_from_token();
    return {
        message : response.message,
        admin_data : JSON.parse(response.admin_data as string)
    };
}

export const useGetAdminByToken  = () =>{
    return useQuery({
        queryKey : ["get_admin_by_token"],
        queryFn : () => fetch_admin_by_token(),
    })
}