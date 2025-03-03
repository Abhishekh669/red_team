import { get_timer_by_id } from "@/actions/timer/timer";
import { useQuery } from "@tanstack/react-query";

export  const fetch_user_timer_by_id = async(timerId : string) =>{
    const response = await get_timer_by_id(timerId);
    return {
        message : response.message,
        timer : JSON.parse(response.timer as string)
    };
}

export const useGetTimerById = (timerId : string) =>{
    return useQuery({
        queryKey : ["get_timer_by_id"],
        queryFn : () => fetch_user_timer_by_id(timerId),
    })
}