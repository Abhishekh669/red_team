import {  deleteQuicksTasks } from "@/actions/plannify/quicktasks/quicktasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useDeleteQuickTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQuicksTasks,
    onSuccess: (res) => {
      if(res.message && res.status){
        //TODO : change the key here
        queryClient.invalidateQueries({ queryKey: ["get_user_quick_tasks"] })
      }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}