"use client";
import Todo from "@/components/todos/todo";
import { useGetUserAllTodos } from "@/utils/hooks/query-hooks/todos/use-get-user-all-todos";
import React from "react";

function TodoPage() {
  const { data: todos, isLoading: todosLoading } = useGetUserAllTodos();
  return (
    <div className="max-h-[calc(100vh-20px)] h-full  overflow-y-hidden  ">
      <div className="p-4">
        <header>
          <h1 className="text-[30px] text-white font-semibold">Todos</h1>{" "}
        </header>
      </div>
      <div className="max-h-[calc(100vh-50px)] h-full overflow-y-auto  lg:overflow-y-hidden p-4 lg:px-2 py-0">
        {todos?.todos && <Todo todos={todos?.todos} />}
      </div>
    </div>
  );
}

export default TodoPage;
