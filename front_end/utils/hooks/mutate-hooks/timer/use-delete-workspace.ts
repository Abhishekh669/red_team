import {  delete_workspace} from "@/actions/timer/timer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: delete_workspace,
    onSuccess: (res) => {
      if(res.message && res.status){

        queryClient.invalidateQueries({ queryKey: ["get_user_workspaces"] })
      }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}