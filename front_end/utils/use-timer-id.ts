import { useParams } from "next/navigation";

export const useTimerId = () =>{
    const params = useParams<{timerId : string}>();
    return params.timerId;
}