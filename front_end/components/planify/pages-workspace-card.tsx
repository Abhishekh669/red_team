"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PageModel } from "@/types"
import { format } from "date-fns"

import { Ellipsis } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react"
import { EditPageWorkspace } from "./edit-page-workspace"
import { useDeletePageWorkspace } from "@/utils/hooks/mutate-hooks/planify/pages/use-delete-page-workspace"
import { useUpdatePageWorkspace } from "@/utils/hooks/mutate-hooks/planify/pages/use-update-page-workspace"
import useConfirm from "@/utils/hooks/use-confirm"
import toast from "react-hot-toast"


interface WorkspaceCardProps {
  workspace: PageModel
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action is irreversible"
  );
    const [isEditModalOpen, setEditIsModalOpen] = useState(false);
    const {mutate : delete_page_workspace, isPending : deleting} = useDeletePageWorkspace();
    const {mutate  : update_page_workspace, isPending : updating} = useUpdatePageWorkspace();
    const handleDeleteWorkspace = async() =>{
      if(deleting || updating)return;
      const ok = await confirm();
      if(!ok) return;
      delete_page_workspace(workspace._id,{
        onSuccess: (res) => {
          if (res.message && res.status) {
            toast.success(res.message);
          } else if(res.error) {
            toast.error(res.error);
          }
        },
        onError: () => {
          toast.error("failed to delete workspace");
        },
      })



    }
    const handleEditPageWorkspace = (name : string, description : string) =>{
      

    }

  return (
   <>
   <ConfirmDialog />
      <EditPageWorkspace
        isOpen={isEditModalOpen}
        onClose={()=> setEditIsModalOpen(false)}
        onEditWorkspace={handleEditPageWorkspace}
        updating_workspace={updating}
        workspaceName={workspace.title}
        workspaceDescription={workspace.description}
      />
     <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="w-full">
           <div className="flex justify-between w-full">
           <CardTitle className="text-lg text-red-600">{workspace.title}</CardTitle>
           <div>
           <DropdownMenu>
            <DropdownMenuTrigger asChild className="">
              <Ellipsis className="text-white cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-950 cursor-pointer text-red-600">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-red-600" />
              <DropdownMenuItem
                className="hover:bg-gray-900/80 cursor-pointer"
                onClick={() => setEditIsModalOpen(true)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-red-600" />
              <DropdownMenuItem
                className="hover:bg-gray-800 cursor-pointer"
                onClick={handleDeleteWorkspace}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
           </div>
           </div>
            <CardDescription className="text-slate-400 mt-1">Created on {format(new Date(workspace.createdAt), "MMM d, yyyy")}</CardDescription>
          </div>
         
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-300">{workspace.description}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/planify/pages/${workspace._id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full bg-red-600 border-slate-700 text-white hover:bg-slate-800 hover:text-red-500"
          >
            Visit Workspace
          </Button>
        </Link>
      </CardFooter>
    </Card>
   </>
  )
}

