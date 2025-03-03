"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Ellipsis, Folder } from "lucide-react";
import { TimerWorkspaceType } from "./TimerWorkspace";
import { EditWorkspaceModal } from "./edit-workspace";
import { useUpdateTimerWorkspace } from "@/utils/hooks/mutate-hooks/timer/use-update-timer-workspace";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDeleteWorkspace } from "@/utils/hooks/mutate-hooks/timer/use-delete-workspace";
import useConfirm from "@/utils/hooks/use-confirm";

interface TimerWorkspaceCardProps {
  workspace: TimerWorkspaceType;
}

function TimerWorkspaceCard({ workspace }: TimerWorkspaceCardProps) {
  const [isEditModalOpen, setEditIsModalOpen] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action is irreversible"
  );
  const { mutate: update_workspace, isPending: updating_workspace } =
    useUpdateTimerWorkspace();

  const { mutate: delete_workspace } = useDeleteWorkspace();
  
  const handleEditWorkspace = (name: string, description: string) => {
    const values = {
      name,
      description,
      workspaceId: workspace._id,
      userId: workspace.userId,
    };
    update_workspace(values, {
      onSuccess: (res) => {
        if (res.message && res.status) {
          toast.success(res.message);
        } else {
          toast.error(res.error);
        }
      },
      onError: () => {
        toast.error("failed to update workspace");
      },
    });
  };

  const handleDeleteWorkspace = async() => {
    const ok = await confirm();
    if(!ok) return;
    delete_workspace(workspace?._id, {
      onSuccess: (res) => {
        if (res.message && res.status) {
          toast.success(res.message);
        } else {
          toast.error(res.error);
        }
      },
      onError: () => {
        toast.error("failed to delete workspace");
      },
    });
  };
  return (
    <>
    <ConfirmDialog />
      <EditWorkspaceModal
        isOpen={isEditModalOpen}
        onClose={() => setEditIsModalOpen(false)}
        onEditWorkspace={handleEditWorkspace}
        updating_workspace={updating_workspace}
        workspaceName={workspace.name}
        workspaceDescription={workspace.description}
      />
      <div className="w-[300px] h-[260px] relative ">
        <Link href={`/timer/${workspace?._id}`} className="z-10">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-900  rounded-[15px] shadow-md overflow-hidden cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-red-500/20  w-full h-full"
          >
            <div className="p-8 flex flex-col  h-full justify-between  ">
              <div>
                <div className="flex items-center mb-4">
                  <Folder className="h-8 w-8 text-red-600 mr-3" />
                  <h2 className="text-2xl font-semibold text-white">
                    {workspace?.name}
                  </h2>
                </div>
                <p className="text-gray-300 mb-4">{workspace?.description}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {workspace?.timerIds?.length || 0} timers
                </span>
              </div>
            </div>
          </motion.div>
        </Link>
        <div className=" w-10 h-10 cursor-pointer  flex items-center justify-center absolute z-999 bottom-6 right-5 bg-red-600  text-white rounded-[10px] p-2 hover:bg-rose-500 transform transition-transform duration-200 hover:scale-105 hover:shadow-lg">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="">
              <Ellipsis className="" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/70 cursor-pointer text-red-600">
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
    </>
  );
}

export default TimerWorkspaceCard;
