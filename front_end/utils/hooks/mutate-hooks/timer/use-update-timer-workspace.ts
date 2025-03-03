import {   edit_workspace_timer_data } from "@/actions/timer/timer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useUpdateTimerWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: edit_workspace_timer_data,
    onSuccess: (res) => {
      if(res.status && res.message){

        queryClient.invalidateQueries({ queryKey: ["get_user_workspaces"] })
      }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}