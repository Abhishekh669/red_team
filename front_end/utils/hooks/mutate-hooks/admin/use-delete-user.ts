import {  delete_user } from "@/actions/admin/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: delete_user,
    onSuccess: (res) => {
      if(res.message && res.status){
        queryClient.invalidateQueries({ queryKey: ["get_users"] })
      }
        
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}