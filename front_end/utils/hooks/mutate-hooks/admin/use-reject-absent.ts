import { reject_absent_request } from "@/actions/admin/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useRejectAbsentRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reject_absent_request,
    onSuccess: (res) => {
        if(res.message && res.status){
          queryClient.invalidateQueries({ queryKey: ["get_user_absent_by_id"] });
        }
      },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}