import { get_user_all_todos } from "@/actions/todo/todo";
import { useQuery } from "@tanstack/react-query";

export  const fetch_user_all_todos = async() =>{
    const response = await get_user_all_todos();
    return {
        message : response.message,
        todos : JSON.parse(response.todos as string)
    };
}

export const useGetUserAllTodos = () =>{
    return useQuery({
        queryKey : ["get_all_todos"],
        queryFn : () => fetch_user_all_todos(),
    })
}