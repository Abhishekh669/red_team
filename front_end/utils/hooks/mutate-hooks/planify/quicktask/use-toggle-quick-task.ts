import {  toggleQuickTasks } from "@/actions/plannify/quicktasks/quicktasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useToggleQuickTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleQuickTasks,
    onSuccess: (res) => {
      if(res.message && res.status){
        queryClient.invalidateQueries({ queryKey: ["get_user_quick_tasks"] })
      }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}