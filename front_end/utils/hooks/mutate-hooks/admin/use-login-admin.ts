import { create_admin, login_admin } from "@/actions/admin/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useLoginAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login_admin,
    onSuccess: () => {
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}