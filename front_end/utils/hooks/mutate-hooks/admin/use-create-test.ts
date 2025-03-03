import {  create_test } from "@/actions/admin/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create_test,
    onSuccess: (res) => {
        if(res.message && res.status){
          queryClient.invalidateQueries({ queryKey: ["get_all_test_data"] }) 
        }

    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}