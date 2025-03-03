import { get_all_attendance } from "@/actions/attendance/attendance";
import { useQuery } from "@tanstack/react-query";

export  const fetch_all_attendance = async() =>{
    const response = await get_all_attendance();
    return {
        message : response.message,
        allAttendance : JSON.parse(response.allAttendance as string)
    };
}

export const useGetAllAttendance = () =>{
    return useQuery({
        queryKey : ["get_all_attendance"],
        queryFn : () => fetch_all_attendance(),
    })
}