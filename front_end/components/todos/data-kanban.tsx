import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { useCallback, useEffect, useState } from "react";
import { TaskStatus, TodoType } from "@/types";
import KanbanCard from "./kanban-card";
import KanbanColumnHeader from "./kanban-column-header";

interface DataKanbanProps {
  data: TodoType[];
  onChange: (
    task: { _id: string; state: TaskStatus; position: number }[]
  ) => void;
}

const boards: TaskStatus[] = [
  TaskStatus.PENDING,
  TaskStatus.ONGOING,
  TaskStatus.DONE,
];

type TaskState = {
  [key in TaskStatus]: TodoType[];
};

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TaskState>(() => {
    const initialTasks: TaskState = {
      [TaskStatus.PENDING]: [],
      [TaskStatus.ONGOING]: [],
      [TaskStatus.DONE]: [],
    };
    data?.forEach((task) => {
      initialTasks[task.state].push(task);
    });
    Object?.keys(initialTasks)?.forEach((state) => {
      initialTasks[state as TaskStatus].sort((a, b) => a.position - b.position);
    });
    return initialTasks;
  });

  useEffect(() => {
    const newTasks: TaskState = {
      [TaskStatus.PENDING]: [],
      [TaskStatus.ONGOING]: [],
      [TaskStatus.DONE]: [],
    };
    data?.forEach((task) => {
      newTasks[task.state].push(task);
    });
    Object?.keys(newTasks)?.forEach((state) => {
      newTasks[state as TaskStatus].sort((a, b) => a.position - b.position);
    });
    setTasks(newTasks);
  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const { source, destination } = result;
      const sourceStatus = source.droppableId as TaskStatus;
      const destStatus = destination.droppableId as TaskStatus;
      let updatedPayload: {
        _id: string;
        state: TaskStatus;
        position: number;
      }[] = [];
      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        //safely remov the task from the source column
        const sourceColumn = [...newTasks[sourceStatus]];
        const [movedTask] = sourceColumn.splice(source.index, 1);
        //if no moved task found
        if (!movedTask) {
          console.error("No task found");
          return prevTasks;
        }

        //crate a new task object iwth updated stastu
        const updateMovedTask =
          sourceStatus !== destStatus
            ? { ...movedTask, state: destStatus }
            : movedTask;
        //updating hte srouce column
        newTasks[sourceStatus] = sourceColumn;

        //adding the task to the destinatio ncolumn
        const destColumn = [...newTasks[destStatus]];
        destColumn.splice(destination.index, 0, updateMovedTask);
        newTasks[destStatus] = destColumn;

        //minimum update payload

        updatedPayload = [];

        //always update the move task
        updatedPayload.push({
          _id: updateMovedTask._id,
          state: destStatus,
          position: Math.min((destination.index + 1) * 1000, 1_000_000),
        });

        //update position   for affected task in the destinatio ncolum
        newTasks[destStatus].forEach((task, index) => {
          if (task && task._id !== updateMovedTask._id) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if (task.position !== newPosition) {
              updatedPayload.push({
                _id: task._id,
                state: destStatus,
                position: newPosition,
              });
            }
          }
        });

        if (sourceStatus !== destStatus) {
          newTasks[sourceStatus].forEach((task, index) => {
            if (task) {
              const newPosition = Math.min((index + 1) * 1000, 1_000_000);
              if (task.position !== newPosition) {
                updatedPayload.push({
                  _id: task._id,
                  state: sourceStatus,
                  position: newPosition,
                });
              }
            }
          });
        }

        return newTasks;
      });

      onChange(updatedPayload);
    },
    [onChange]
  );
  return (
    <div className=" h-full lg:max-h-[690px] lg:h-[690px]  p-0 lg:overflow-hidden ">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3  gap-x-4 md:p-10 h-full   lg:p-1 lg:pt-4">
          {" "}
          {/* for the whole board like pending, ongoing done*/}
          {boards.map((board) => (
            <div
                key={board}
                className="  lg:max-h-[685px] lg:h-[685px] max-h-[700px] h-[700px]  p-2 rounded-md"
            >
                <div
              // for individual card
              className="bg-slate-900 p-2 rounded-lg text-red-600 lg:max-h-[650px] lg:h-[690px] max-h-[690px] h-[650px]  "
            >
                <div className="my-3 mx-2">
                  <KanbanColumnHeader
                    board={board}
                    todoCount={tasks[board].length}
                    />
                </div>
                <div className=" lg:max-h-[600px] max-h-[560px] h-[560px] lg:h-[550px] overflow-y-auto ">
                <Droppable droppableId={board}>
                  {(provided) => (
                    <div
                      className=" h-auto grid grid-cols-1 gap-y-4 p-4   md:p-4 "
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {tasks[board].map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided, dragSnapshot: DraggableStateSnapshot) => (
                            <div
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                            >
                              <KanbanCard
                                task={task}
                                isDragging={dragSnapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>

            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
