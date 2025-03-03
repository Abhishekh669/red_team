import { create_admin } from "@/actions/admin/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create_admin,
    onSuccess: () => {
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}