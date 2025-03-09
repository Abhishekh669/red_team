import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Ellipsis } from "lucide-react";
import Hint from "../Hint";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
// import EditTodo from "./edit-todo";
import { TodoType } from "@/types";

interface KanbanCardProps {
  task: TodoType;
  isDragging: boolean;
}

function KanbanCard({ task, isDragging }: KanbanCardProps) {
  const [openEdit, setOpenEdit] = useState(false);
  return (
    <>
      {/* <EditTodo  todo={task} openEdit={openEdit} onClose={()=>setOpenEdit(false)}/> */}
      <Card
      className={cn("px-2 pt-6 flex flex-col bg-gray-800 text-red-600", isDragging && "bg-gray-700")}
    >
      <CardContent className="flex flex-col   gap-y-2">
        <CardTitle className="flex justify-between items-center">
          <span >{task.title}</span>
          <span>
           <Ellipsis className="size-5 text-white" onClick={() => setOpenEdit(true)}/>
          </span>
        </CardTitle>
        <Separator />
        <CardDescription className="text-white">{task.description}</CardDescription>
        <Separator />
        <div className="flex justify-between text-white">
          <Hint
            label={`${format(task.updatedAt, "yyyy-M-d")} ${format(task.updatedAt, "p")}`}
          >
            <div className="flex h-6 items-center gap-2 ">
              <CalendarIcon className=" size-3 text-white lg:size-4 " />
              <CardDescription className="text-xs lg:text-sm text-white">{format(task.updatedAt, "yyyy-M-d")}</CardDescription>
            </div>
          </Hint>
          <CardDescription
            className={cn(
              "roudned-md px-1 py-0.5 rounded-sm ",
              task.tag === "HIGH" && "text-red-600 bg-red-300/30",
              task.tag === "LOW" && "text-green-600 bg-green-300/30",
              task.tag === "MEDIUM" && "text-yellow-600 bg-yellow-300/30"
            )}
          >
            <span className="text-xs">{task.tag}</span>
          </CardDescription>
        </div>
      </CardContent>
    </Card>
    </>
  );
}

export default KanbanCard;