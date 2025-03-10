import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateTodoModal } from "@/utils/store/todos/use-create-todo-modol";
import { useTodoState } from "@/utils/store/todos/use-todo-state";
import { useCreateTodo } from "@/utils/hooks/mutate-hooks/todo/use-create-new-todo";
import { TaskStatus, TaskTag, todoSchema } from "@/types";


function TodoForm() {
    const [open ,setOpen] = useCreateTodoModal();
    const [new_state, setNewState] = useTodoState();
  const { mutate: createTodo, isPending: todoLoading } = useCreateTodo();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof todoSchema>>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
      tag: "MEDIUM",
      state: new_state,
    },
  });
  const handleClose =() =>{
    setOpen(false);
  }

  const onSubmit = async (values: z.infer<typeof todoSchema>) => {
    await createTodo({...values, state : new_state}, {
      onSuccess: (res) => {
        if (res.message && res.status) {
          toast.success("Successfully created todo");
          reset();
          handleClose();
          setNewState(TaskStatus.PENDING);
        } else {
          toast.error("Failed to create todo");
        }
      },
      onError: (err) => {
        toast.error(err.message || "Something went wrong");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Todo</DialogTitle>
          <DialogDescription>Keep track of your daily tasks</DialogDescription>
        </DialogHeader>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                placeholder="Enter title"
                {...register("title")}
                disabled={todoLoading}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                placeholder="Enter description"
                {...register("description")}
                disabled={todoLoading}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tag</label>
              <Select
                onValueChange={(value : TaskTag) => setValue("tag", value)}
                defaultValue="MEDIUM"
                disabled={todoLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
              {errors.tag && (
                <p className="text-sm text-red-500">{errors.tag.message}</p>
              )}
            </div>



            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              disabled={todoLoading}
            >
              {todoLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Todo"
              )}
            </Button>
          </form>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TodoForm;