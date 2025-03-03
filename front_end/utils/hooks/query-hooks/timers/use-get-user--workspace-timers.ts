import {  get_user_workspace_timers } from "@/actions/timer/timer";
import { useQuery } from "@tanstack/react-query";

export  const fetch_user_workspace_timers = async(workspaceId : string) =>{
    const response = await get_user_workspace_timers(workspaceId);
    return {
        message : response.message,
        timers : JSON.parse(response.timers as string)
    };
}

export const useGetUserWorkspaceTimers = (Id : string) =>{
    return useQuery({
        queryKey : ["get_user_workspace_timers"],
        queryFn : () => fetch_user_workspace_timers(Id),
    })
}