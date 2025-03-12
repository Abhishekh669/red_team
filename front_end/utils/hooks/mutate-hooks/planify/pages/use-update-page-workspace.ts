import { CreatePage, updatePageWorkspaceData } from "@/actions/plannify/pages/pages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useUpdatePageWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePageWorkspaceData,
    onSuccess: (res) => {
      if(res.message && res.status){

        queryClient.invalidateQueries({ queryKey: ["get_user_all_pages"] })
      }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}