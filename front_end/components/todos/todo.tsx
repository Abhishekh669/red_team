import { TaskStatus, TodoType } from '@/types'
import React, { useCallback } from 'react'
import { DataKanban } from './data-kanban'
interface TodoDataProps{
    todos : TodoType[]
}

function Todo({todos} : TodoDataProps) {
  const onKanbanChange = useCallback((
    tasks : {_id : string; state : TaskStatus; position : number;}[],
  )=>{
  },[])
  return (
    <div className=' w-full h-full   '>
    <DataKanban data={todos} onChange={onKanbanChange}/>
  </div>
  )
}

export default Todo
