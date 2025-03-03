import React, { useState } from "react";
import CreateWorkspaceCard from "./create-timer-workspace";
import TimerWorkspaceCard from "./timer-workspace-card";
import { CreateWorkspaceModal } from "./create-workspace-modal";
import { useCreateTimerWorkspace } from "@/utils/hooks/mutate-hooks/timer/use-create-timer-workspace";
import toast from "react-hot-toast";
import { useGetSession } from "@/utils/hooks/query-hooks/sessions/use-get-sessions";
import { useRouter } from "next/navigation";
export interface TimerWorkspaceType {
  _id: string;
  name: string;
  description: string;
  timerIds: string[];
  userId: string;
  createdAt: Date;
}

interface TimerWorkspaceProps {
  workspaces: TimerWorkspaceType[];
}

function TimerWorkspace({ workspaces }: TimerWorkspaceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {mutate : create_timerWorkspace}  = useCreateTimerWorkspace()
  const {data : session} = useGetSession()
  const router = useRouter()

  const handleCreateWorkspace = (name: string, description: string) => {
    console.log("this is hte new owrkspace data : ",name , description)
    if(!name || !description || !session?.user?._id){
        toast.error("name or description is missing")
    }

    const data = {
        
        userId : session?.user._id,
        name,
        description
    }

    

    create_timerWorkspace(data,{
        onSuccess : (res) =>{
            if(res.message && res.timerWorkspace){
                const timer_workspace = JSON.parse(res.timerWorkspace)
                console.log("this is hte timer workspace : ",timer_workspace)
                toast.success(res.message)
            }else{
                toast.error(res.error)
            }
        },
        onError : () =>{
            toast.error("something went wrong")
        }
    })


  };

 
  return (
    <div className="py-12 px-8  lg:px-10">
      <div className="max-w-7xl  flex flex-col gap-y-4">
        <h1 className="text-4xl font-bold text-white mb-8  text-center">Your Workspaces</h1>
        <div className="flex flex-wrap  justify-center gap-x-16 gap-y-6">
        <CreateWorkspaceCard onClick={() => setIsModalOpen(true)} />
          {workspaces &&
            workspaces.map((workspace) => (
                 <TimerWorkspaceCard key={workspace._id} workspace={workspace} />
            ))}
        </div>
      </div>
     
      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateWorkspace={handleCreateWorkspace}
      />
    </div>
  );
}

export default TimerWorkspace;
