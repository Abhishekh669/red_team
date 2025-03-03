import { useParams } from "next/navigation";

export const useUserId = () =>{
    const params = useParams<{userId : string}>();
    return params.userId;
}