import { TaskStatus, TodoType } from '@/types'
import React, { useCallback, useMemo } from 'react'
import { DataKanban } from './data-kanban'
import TodoForm from './todo-form'
import { useDeleteTodo } from '@/utils/hooks/mutate-hooks/todo/use-delete-todo'
import toast from 'react-hot-toast'
import { useBulkUpdateTodo } from '@/utils/hooks/mutate-hooks/todo/use-bulk-update'
interface TodoDataProps{
    todos : TodoType[]
}

function Todo({todos} : TodoDataProps) {
  const memoizedTodos = useMemo(()=>todos,[todos])
  const {mutate : delete_todo, isPending : deleting} = useDeleteTodo();
  const {mutate : bulk_update, isPending : updating}  = useBulkUpdateTodo()
  
  const onKanbanChange = useCallback((
    tasks : {_id : string; state : TaskStatus; position : number;}[],
  )=>{
    if(updating){
      toast.error("Previous update is on progress")
      return
    }

    bulk_update(tasks,{
      onSuccess : (res) =>{
        if(res.error) toast.success(res.error)
      },
      onError : (err) =>{
        toast.error(err.message || "something went wrong")
      }
    })

  },[])

  const onDelete = useCallback((id : string)=>{
    if(deleting){
      toast.error("Previous delete is on progress")
      return
    }
    if(id){
      delete_todo(id,{
        onSuccess : (res) =>{
          if(res.status && res.message) toast.success(res.message)
          else toast.error(res.error)
        },
        onError : (err) =>{
          toast.error(err.message || "something went wrong")
        }
      })
    }
  },[])
  return (
    <div className=' w-full h-full   '>
    <TodoForm />
    <DataKanban data={memoizedTodos} onChange={onKanbanChange} onDelete={onDelete}/>
  </div>
  )
}

export default Todo
