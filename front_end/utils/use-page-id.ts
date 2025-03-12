import { useParams } from "next/navigation";

export const usePageId= () =>{
    const params = useParams<{pageId : string}>();
    return params.pageId;
}