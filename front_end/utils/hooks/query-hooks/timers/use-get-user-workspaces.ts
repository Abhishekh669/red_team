import { get_user_timer_workspaces } from "@/actions/timer/timer";
import { useQuery } from "@tanstack/react-query";

export  const fetch_user_timer_workspaces = async() =>{
    const response = await get_user_timer_workspaces()
    return {
        message : response.message,
        timer_workspaces : JSON.parse(response.timer_workspaces as string)
    };
}

export const useGetUserTimerWorkspaces = () =>{
    return useQuery({
        queryKey : ["get_user_workspaces"],
        queryFn : () => fetch_user_timer_workspaces(),
    })
}