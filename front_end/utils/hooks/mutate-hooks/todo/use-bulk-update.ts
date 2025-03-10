import {  todoBulkUpdate } from "@/actions/todo/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useBulkUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: todoBulkUpdate,
    onSuccess: (res) => {
      if(res.message && res.status){
        queryClient.invalidateQueries({ queryKey: ["get_all_todos"] })
      }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}