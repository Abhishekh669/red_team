import { create_admin, update_test_score } from "@/actions/admin/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useUpdateTestScore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update_test_score,
    onSuccess: (res) => {
        if(res.status && res.message){
            queryClient.invalidateQueries({ queryKey: ["get_test_by_id"] })
  
          }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}