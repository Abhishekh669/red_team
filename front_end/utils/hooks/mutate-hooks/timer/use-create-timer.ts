import { create_timer } from "@/actions/timer/timer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateTimer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create_timer,
    onSuccess: (res) => {
      if(res.message && res.timer){

        queryClient.invalidateQueries({ queryKey: ["get_user_workspace_timers"] })
      }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}