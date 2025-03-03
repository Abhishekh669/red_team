import {  create_timer_wrokspace } from "@/actions/timer/timer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateTimerWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create_timer_wrokspace,
    onSuccess: (res) => {
      if(res.message && res.timerWorkspace){

        queryClient.invalidateQueries({ queryKey: ["get_user_workspaces"] })
      }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}