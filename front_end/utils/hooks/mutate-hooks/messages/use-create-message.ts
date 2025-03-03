import { create_message } from "@/actions/messages/message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create_message,

    onSuccess: (res) => {
      if(res.message && res.msg){
        queryClient.invalidateQueries({ queryKey: ["get_messages"] });
      }
    },
    onError: () => {},
    onSettled: () => {},
    onMutate: () => {},
  });
};
