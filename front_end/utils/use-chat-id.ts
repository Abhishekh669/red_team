import { useParams } from "next/navigation";

export const useChatId = () =>{
    const params = useParams<{chatId : string}>();
    return params.chatId;
}