import {  reject_user } from "@/actions/admin/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useRejectUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reject_user,
    onSuccess: (res) => {
        if(res.message && res.status){
          queryClient.invalidateQueries({ queryKey: ["get_unverified_users"] })
        }

    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}