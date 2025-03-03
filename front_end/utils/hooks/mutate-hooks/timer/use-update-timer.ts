import {  edit_timer_data } from "@/actions/timer/timer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useUpdateTimer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: edit_timer_data,
    onSuccess: (res) => {
      if(res.status && res.message){
        queryClient.invalidateQueries({ queryKey: ["get_user_workspace_timers"] })
      }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}