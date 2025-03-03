import { useParams } from "next/navigation";

export const useTestId = () =>{
    const params = useParams<{testId : string}>();
    return params.testId;
}