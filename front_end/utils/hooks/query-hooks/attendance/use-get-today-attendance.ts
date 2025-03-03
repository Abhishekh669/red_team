import { get_today_attendance } from "@/actions/attendance/attendance";
import { useQuery } from "@tanstack/react-query";

export  const fetch_today_attendance = async() =>{
    const response = await get_today_attendance();
    return {
        message : response.message,
        todayAttendance : JSON.parse(response.todayAttendance as string)
    };
}

export const useGetTodayAttendance= () =>{
    return useQuery({
        queryKey : ["get_today_attendance"],
        queryFn : () => fetch_today_attendance(),
    })
}