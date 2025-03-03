import {  verify_user } from "@/actions/admin/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useVerifyUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verify_user,
    onSuccess: (res) => {
      if(res.status && res.message){
        queryClient.invalidateQueries({ queryKey: ['get_unverified_users'] })
      }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}