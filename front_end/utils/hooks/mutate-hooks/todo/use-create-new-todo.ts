import { CreateTodo } from "@/actions/todo/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CreateTodo,
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