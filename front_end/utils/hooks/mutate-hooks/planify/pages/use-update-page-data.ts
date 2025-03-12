import { CreatePage, updatePageData } from "@/actions/plannify/pages/pages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useUpdatePageData= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePageData,
    onSuccess: (res) => {
      if(res.message && res.status){
        queryClient.invalidateQueries({ queryKey: ["get_page_by_id"] })
      }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}