import React from 'react'
import {
    Clock,
    Activity,
    CheckCircle,
    PlusIcon,
} from "lucide-react"
import { Button } from '@/components/ui/button';
import { TaskStatus } from '@/types';
import { useCreateTodoModal } from '@/utils/store/todos/use-create-todo-modol';
import { useTodoState } from '@/utils/store/todos/use-todo-state';

interface KanbanColumnHeaderProps{
    board : TaskStatus;
    todoCount : number
}

const statusIconMap : Record<TaskStatus, React.ReactNode> ={
    [TaskStatus.PENDING] : (
        <Clock className='size-[18px] text-[#FFB400]'/>
    ),
    [TaskStatus.ONGOING] : (
        <Activity className='size-[18px] text-[#007BFF]'/>
    ),
    [TaskStatus.DONE] : (
        <CheckCircle className='size-[18px] text-[#28A745]'/>
    )
}

function KanbanColumnHeader({board, todoCount}: KanbanColumnHeaderProps) {
    const [_open, setOpen] = useCreateTodoModal();
    const [_state, setState] = useTodoState();
    const icon = statusIconMap[board];
  return (
    <div className='px-1  py-1.5 flex  items-center justify-between gap-x-2'>
      <div className=' flex items-center gap-x-4'>
        {icon}
        <h2 className='text-sm font-medium'>
            {board}
        </h2>
        <div className='flex size-5  items-center justify-center rounded-md font-medium text-xs bg-neutral-200 text-neutral-700'>
            {todoCount}
        </div>
      </div>
      <Button className='size-5 ' size="icon" variant={"ghost"} onClick={()=>{
        setState(board);
        setOpen(true);
      }}>
        <PlusIcon  className='size-4 text-neutral-500'/>
      </Button>
    </div>
  )
}

export default KanbanColumnHeader