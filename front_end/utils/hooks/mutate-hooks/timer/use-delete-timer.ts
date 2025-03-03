import {  delete_timer } from "@/actions/timer/timer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useDeleteTimer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: delete_timer,
    onSuccess: (res) => {
      if(res.message && res.status){

        queryClient.invalidateQueries({ queryKey: ["get_user_workspace_timers"] })
      }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}