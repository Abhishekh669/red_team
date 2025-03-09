
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash } from "lucide-react";
import { Todo } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import EditOptionTodo from "./edit-option-todo";
import useConfirm from "./confirm";
import { useDeleteTodo } from "@/utils/hooks/mutate-hooks/todos/use-delete-todo";
import { useGetLoggedInUser } from "@/utils/hooks/query-hooks/user/use-get-logged-user";
import toast from "react-hot-toast";

interface EditTodoProps{
    openEdit : boolean;
    onClose : () => void;
    todo : Todo;
}


function EditTodo({
    openEdit,
    onClose,
    todo
} : EditTodoProps) {
    const [deleteOpen, setDeleteOpen] = useState();
    const [editOption, setEditOption] = useState(false);
    const [ConfirmDialog, confirm] = useConfirm(
      "Are you sure?",
      "This action is irreversible"
    );
    const {data : session} = useGetLoggedInUser();
    const {mutate : delete_todo, isPending : deleting} = useDeleteTodo();
    const handle_delete = async() =>{
      const ok = await confirm();
      if(!ok) return;
      delete_todo({
        userId : session?.user?.id as string,
        todoId : todo.id
      },
      {
        onSuccess : (res) =>{
          if(res.message && res.deleted_todo){
            toast.success(res.message || "Successfully deleted todo");
          }  else if (res.error) {
            toast.error(res.error);
          }
        },
        onError: () => {
          toast.error( "Failed to delete Error" );
        },
        }
      )

    }
  return (

<>
<ConfirmDialog />
<EditOptionTodo todo={todo} editOption={editOption} onClose={()=> setEditOption(false)}/>
<Dialog open={openEdit} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Options</DialogTitle>
        <div className="flex flex-col gap-y-2">
          <div className="cursor-pointer flex justify-between hover:text-muted-foreground hover:bg-gray-200 p-2 rounded-md"
            onClick={() => setEditOption(true)}
          >
            Edit
            <Edit />
          </div>
          <Separator className="bg-black/40" />
          <div onClick={handle_delete} className="cursor-pointer flex justify-between text-red-400 hover:text-muted-foreground hover:bg-red-200 p-2 rounded-md hover:text-red-400 ">
            Delete
            <Trash />
          </div>
        </div>
      </DialogContent>
    </Dialog>
</>
    
  );
}

export default EditTodo;



                  
