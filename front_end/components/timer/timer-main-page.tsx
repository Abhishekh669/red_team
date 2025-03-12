"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TimeProvider } from "@/utils/store/timer/context/time-context";
import { Timer } from "./timer";
import { TimerCreationCard } from "./timer-creation-card";
import { useCreateTimer } from "@/utils/hooks/mutate-hooks/timer/use-create-timer";
import { useGetSession } from "@/utils/hooks/query-hooks/sessions/use-get-sessions";
import toast from "react-hot-toast";
import { useGetUserWorkspaceTimers } from "@/utils/hooks/query-hooks/timers/use-get-user--workspace-timers";
import { EditTimerDataType, TimerCreateType } from "@/actions/timer/timer";
import { useUpdateTimer } from "@/utils/hooks/mutate-hooks/timer/use-update-timer";
import { useTimerId } from "@/utils/use-timer-id";
import { useDeleteTimer } from "@/utils/hooks/mutate-hooks/timer/use-delete-timer";
import Link from "next/link";
import { ArrowLeftSquare } from "lucide-react";
import Hint from "../Hint";
import { Loader } from "../ui/Loader";


export interface TimerDataType {
  _id: string;
  timerWorkspaceId : string,
  name: string;
  endDate: Date;
  type : 'till' | 'from'
  userId : string,
  createdAt : Date
}




export function TimerMainPage() {
    const timerId = useTimerId()
    const {data : timers, isLoading : timers_loading} = useGetUserWorkspaceTimers(timerId);
  const { data: session, isLoading: session_loading } = useGetSession();
  const { mutate: create_new_timer, isPending: timer_pending } =
    useCreateTimer();

    const {mutate : update_timer, isPending : updating_timer} = useUpdateTimer();
    const {mutate : delete_timer, isPending : deleting_timer} = useDeleteTimer()

  
  const handleCreateTimer = async (
    newTimer: Omit<TimerCreateType, "userId">
  ) => {
    if(timer_pending)return;
    const values = {
      timerWorkspaceId: newTimer.timerWorkspaceId,
      userId: session?.user._id as string,
      name: newTimer.name,
      endDate: newTimer.endDate,
      type: newTimer.type,
    };

    create_new_timer(values, {
      onSuccess: (res) => {
        if (res.message && res.timer) {
          toast.success("created new timer");
        } else if(res.error){
          toast.error(res.error);
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const handleDeleteTimer = (id: string) => {
    if(!id && deleting_timer) return;
    const values = {
      workspaceId : timerId,
      id
    }
    delete_timer(values,{
      onSuccess : (res) =>{
        if(res.status && res.message){
          toast.success("deleted successfully")
        }else{
          toast.error("failed to delete")
        }
      },
      onError : () =>{
        toast.error("failed to delete")
      }
    })
  };  




  const handleUpdateTimer = (values : EditTimerDataType) => {
    if(values && !updating_timer){
      update_timer(values,{
              onSuccess : (res) =>{
                if(res.status && res.message){
                  console.log("this is the repsone : ",res)
                  toast.success("updated successfully")
                }else{
                  toast.error("failed to update ")
                }
              },
              onError : () =>{
                toast.error("failed to update")
              }
            })
      
    }
  };

  if(timers_loading || session_loading)return <Loader />

  return (
    <TimeProvider>
      <div className="p-2 bg-black">
        <Hint label="go back">
        <Link href={"/timer"} className="text-rose-600">
          <ArrowLeftSquare />
        </Link>
        </Hint>
      </div>
      <div className=" bg-black flex flex-col items-center justify-center py-20">
        <motion.div
          className="flex flex-wrap  justify-center gap-y-10 gap-x-10"
          layout
        >
          <TimerCreationCard onCreateTimer={handleCreateTimer} />
         
          <AnimatePresence>
            {timers?.timers && timers.timers.length > 0 &&
              timers?.timers.map((timer: TimerDataType) => (
                <div key={timer._id} >
                  <motion.div
                    key={timer._id}
                    layout
                    whileHover={{scale : 1.05}}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Timer timer={timer} onDelete={handleDeleteTimer}  onUpdate={handleUpdateTimer} updating={updating_timer}/>
                  </motion.div>
                </div>
              ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </TimeProvider>
  );
}
