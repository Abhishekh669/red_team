import { CreatePage, deletePageWorkspaceData } from "@/actions/plannify/pages/pages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useDeletePageWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePageWorkspaceData,
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