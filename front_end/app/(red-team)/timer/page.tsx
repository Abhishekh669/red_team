"use client"
import TimerWorkspace from '@/components/timer/TimerWorkspace';
import { Loader } from '@/components/ui/Loader';
import { useGetUserTimerWorkspaces } from '@/utils/hooks/query-hooks/timers/use-get-user-workspaces';
import React from 'react'

function TimerPage() {
  const {data : timer_workspaces , isLoading : timer_workspaces_loading} = useGetUserTimerWorkspaces()

  if(timer_workspaces_loading) return <Loader />


  return (
    <div className='h-full w-full bg-black '>
      <TimerWorkspace workspaces={timer_workspaces?.timer_workspaces} />
    </div>
  )
}

export default TimerPage
