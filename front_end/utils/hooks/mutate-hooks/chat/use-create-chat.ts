
import { create_chat } from "@/actions/chats/chat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create_chat,
    
    onSuccess: () => {
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}