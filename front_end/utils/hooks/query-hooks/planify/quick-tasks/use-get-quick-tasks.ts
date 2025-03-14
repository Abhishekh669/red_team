import { getUserQuickTasks } from "@/actions/plannify/quicktasks/quicktasks";
import { useQuery } from "@tanstack/react-query";

export  const fetch_user_quick_tasks= async () =>{
    const response = await getUserQuickTasks();
    return {
        message : response.message,
        quickTasks : JSON.parse(response.quickTasks as string)
    };
}

export const useGetUserQuickTasks= () =>{
    return useQuery({
        queryKey : ["get_user_quick_tasks"],
        queryFn : () => fetch_user_quick_tasks(),
    })
}