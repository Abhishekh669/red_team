import { CreatePage } from "@/actions/plannify/pages/pages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CreatePage,
    onSuccess: (res) => {
      if(res.message && res.pageData){

        queryClient.invalidateQueries({ queryKey: ["get_user_all_pages"] })
      }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}