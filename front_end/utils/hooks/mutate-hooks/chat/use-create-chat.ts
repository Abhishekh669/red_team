
import { create_chat } from "@/actions/chats/chat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create_chat,
    
    onSuccess: (res) => {
      if(res.chat && res.message){
        queryClient.invalidateQueries({ queryKey: ["get_all_user_conversations"] })

      }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}