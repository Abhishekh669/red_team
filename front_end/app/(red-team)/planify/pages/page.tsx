"use client"

import { CreateWorkspaceDialog, WorkspaceFormData } from "@/components/planify/create-pages-dailogbox";
import { WorkspaceHeader } from "@/components/planify/page-workspace-header";
import { WorkspaceList } from "@/components/planify/pages-workspace-list";
import { useCreatePage } from "@/utils/hooks/mutate-hooks/planify/pages/use-create-page";
import { useGetUserAllPages } from "@/utils/hooks/query-hooks/planify/pages/use-get-user-all-pages"
import { useState } from "react"
import toast from "react-hot-toast";

export default function WorkspaceManager() {

  const {data : pages, isLoading : pagesLoading} = useGetUserAllPages();
  const {mutate : create_page, isPending : creating} = useCreatePage();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateWorkspace = (newWorkspace: WorkspaceFormData) => {
    if(creating)return;
    const newData = {
      ...newWorkspace,
      type : "editor"
    }
    create_page(newData, {
      onSuccess: (res) => {
        if (res.message && res.pageData) {
          toast.success(res.message);
          setIsDialogOpen(false)
        } else {
          toast.error(res.error);
        }
      },
      onError: (err) => {
        toast.error(err.message || "Something went wrong");
      },
    })
    
   
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <WorkspaceHeader onCreateClick={() => setIsDialogOpen(true)} />

        <CreateWorkspaceDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onCreateWorkspace={handleCreateWorkspace}
        />

        {
          pages?.pages && pages.pages.length > 0 && (
            <WorkspaceList workspaces={pages.pages}/>
          )
        }


        {/* <WorkspaceList workspaces=/> */}
        
      </div>
    </div>
  )
}

