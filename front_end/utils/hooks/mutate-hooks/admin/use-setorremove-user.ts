import {   set_or_delete_user } from "@/actions/admin/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useSetOrDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: set_or_delete_user,
    onSuccess: (res) => {
        if(res.status && res.message){
          queryClient.invalidateQueries({ queryKey: ["get_users"] })

        }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}