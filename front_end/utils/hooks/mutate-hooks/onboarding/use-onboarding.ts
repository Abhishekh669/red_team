import { onboard_user } from "@/actions/onboarding/onboarding";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useOnboarding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: onboard_user,
    onSuccess: (res) => {
      if(res.message && res.onboarded_user){
        queryClient.invalidateQueries({ queryKey: ["get_user_by_id"] })
      }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}