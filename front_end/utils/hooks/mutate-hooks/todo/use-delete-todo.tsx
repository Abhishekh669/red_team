import { deleteTodo } from "@/actions/todo/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTodo,
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