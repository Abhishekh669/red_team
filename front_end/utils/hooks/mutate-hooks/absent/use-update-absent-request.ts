import { createAbsentRequest, update_absent_request } from "@/actions/absent/absent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useUpdateAbsentRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update_absent_request,
    onSuccess: (res) => {
        if(res.status && res.message){
            queryClient.invalidateQueries({ queryKey: ["get_user_all_absent_request"] })
        } 
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}