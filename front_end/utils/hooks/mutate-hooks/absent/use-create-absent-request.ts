import { createAbsentRequest } from "@/actions/absent/absent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateAbsentRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAbsentRequest,
    onSuccess: (res) => {
        if(res.creationStatus && res.message){
            queryClient.invalidateQueries({ queryKey: ["get_user_all_absent_request"] })
        } 
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}