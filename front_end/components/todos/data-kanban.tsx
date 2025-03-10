import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
  DraggableStateSnapshot,
  DragUpdate,
  DragStart,
} from "@hello-pangea/dnd";
import { useCallback, useEffect, useRef, useState } from "react";
import { TaskStatus, TodoType } from "@/types";
import KanbanCard from "./kanban-card";
import KanbanColumnHeader from "./kanban-column-header";
import { Trash2 } from "lucide-react";

interface DataKanbanProps {
  data: TodoType[];
  onChange: (
    task: { _id: string; state: TaskStatus; position: number }[]
  ) => void;
  onDelete?: (taskId: string) => void;
}

const boards: TaskStatus[] = [
  TaskStatus.PENDING,
  TaskStatus.ONGOING,
  TaskStatus.DONE,
];

type TaskState = {
  [key in TaskStatus]: TodoType[];
};

export const DataKanban = ({ data, onChange, onDelete }: DataKanbanProps) => {
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

  const [isDraggingOverDeleteZone, setIsDraggingOverDeleteZone] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const onDragStart = useCallback((start : DragStart) => {
    setDraggingId(start.draggableId);
  }, []);

  const onDragUpdate = useCallback((result : DragUpdate) => {
    if (!result.destination) return;
    setIsDraggingOverDeleteZone(result.destination.droppableId === "DELETE_ZONE");
  }, []);

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      // Simply call the onDelete callback with the taskId
      if (onDelete) {
        onDelete(taskId);
      }
    },
    [onDelete]
  );

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
      console.log("source : ", source, "destination", destination);
  
      setIsDraggingOverDeleteZone(false);
      setDraggingId(null);
  
      // If the task is dropped in the "DELETE_ZONE", handle deletion
      if (destination?.droppableId === "DELETE_ZONE" && draggingId) {
        handleDeleteTask(draggingId);
        return;
      }
  
      const sourceStatus = source.droppableId as TaskStatus;
      const destStatus = destination.droppableId as TaskStatus;
  
      let updatedPayload: {
        _id: string;
        state: TaskStatus;
        position: number;
      }[] = [];
  
      // Create a copy of the current tasks
      const newTasks = { ...tasks };
  
      // Safely remove the task from the source column
      const sourceColumn = [...newTasks[sourceStatus]];
      const [movedTask] = sourceColumn.splice(source.index, 1);
  
      // If no moved task is found, return early
      if (!movedTask) {
        console.error("No task found");
        return;
      }
  
      // Create a new task object with updated status if necessary
      const updatedMovedTask =
        sourceStatus !== destStatus
          ? { ...movedTask, state: destStatus }
          : movedTask;
  
      // Update the source column
      newTasks[sourceStatus] = sourceColumn;
  
      // Add the task to the destination column
      const destColumn = [...newTasks[destStatus]];
      destColumn.splice(destination.index, 0, updatedMovedTask);
      newTasks[destStatus] = destColumn;
  
      // Always update the moved task
      updatedPayload.push({
        _id: updatedMovedTask._id,
        state: destStatus,
        position: Math.min((destination.index + 1) * 1000, 1_000_000),
      });
  
      // Update positions for affected tasks in the destination column
      newTasks[destStatus].forEach((task, index) => {
        if (task && task._id !== updatedMovedTask._id) {
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
  
      // If the task is moved to a different column, update positions in the source column
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
  
      // Update the state with the new tasks
      setTasks(newTasks);
  
      // Log the updated payload
      console.log("this is updatedPayload : ", updatedPayload);
  
      // Call the onChange callback with the updated payload
      onChange(updatedPayload);
    },
    [draggingId, onChange, handleDeleteTask, tasks]
  );

//   const onDragEnd = useCallback(
//     (result: DropResult) => {
//       if (!result.destination) return;
//       const { source, destination } = result;
//       console.log("source : ",source, "destination" ,destination)

//       setIsDraggingOverDeleteZone(false);
//       setDraggingId(null);

//       // If the task is dropped in the "DELETE_ZONE", handle deletion
//       if (destination?.droppableId === "DELETE_ZONE" && draggingId) {
//         handleDeleteTask(draggingId);
//         return;
//       }

 
//       const sourceStatus = source.droppableId as TaskStatus;
//       const destStatus = destination.droppableId as TaskStatus;

//       let updatedPayload: {
//         _id: string;
//         state: TaskStatus;
//         position: number;
//       }[] = [];
//       setTasks((prevTasks) => {
//         const newTasks = { ...prevTasks };
//         //safely remov the task from the source column
//         const sourceColumn = [...newTasks[sourceStatus]];
//         const [movedTask] = sourceColumn.splice(source.index, 1);
//         //if no moved task found
//         if (!movedTask) {
//           console.error("No task found");
//           return prevTasks;
//         }

//         //crate a new task object iwth updated stastu
//         const updateMovedTask =
//           sourceStatus !== destStatus
//             ? { ...movedTask, state: destStatus }
//             : movedTask;
//         //updating hte srouce column
//         newTasks[sourceStatus] = sourceColumn;

//         //adding the task to the destinatio ncolumn
//         const destColumn = [...newTasks[destStatus]];
//         destColumn.splice(destination.index, 0, updateMovedTask);
//         newTasks[destStatus] = destColumn;

//         //minimum update payload

//         updatedPayload = [];

//         //always update the move task
//         updatedPayload.push({
//           _id: updateMovedTask._id,
//           state: destStatus,
//           position: Math.min((destination.index + 1) * 1000, 1_000_000),
//         });

//         //update position   for affected task in the destinatio ncolum
//         newTasks[destStatus].forEach((task, index) => {
//           if (task && task._id !== updateMovedTask._id) {
//             const newPosition = Math.min((index + 1) * 1000, 1_000_000);
//             if (task.position !== newPosition) {
//               updatedPayload.push({
//                 _id: task._id,
//                 state: destStatus,
//                 position: newPosition,
//               });
//             }
//           }
//         });

//         if (sourceStatus !== destStatus) {
//           newTasks[sourceStatus].forEach((task, index) => {
//             if (task) {
//               const newPosition = Math.min((index + 1) * 1000, 1_000_000);
//               if (task.position !== newPosition) {
//                 updatedPayload.push({
//                   _id: task._id,
//                   state: sourceStatus,
//                   position: newPosition,
//                 });
//               }
//             }
//           });
//         }

//         return newTasks;
//       });
//       console.log("this is updatedPayload : ",updatedPayload)

//       onChange(updatedPayload);
//     },
//     [draggingId, onChange, handleDeleteTask]
//   );
  return (
    <>
      <style jsx global>{`
        @keyframes float-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-20px);
            opacity: 0.2;
          }
        }

        .delete-animation {
          animation: float-up 0.5s ease-in-out infinite alternate;
        }

        .delete-zone-active {
          transition: all 0.3s ease;
          background-color: rgba(239, 68, 68, 0.3);
          box-shadow: 0 -5px 20px rgba(239, 68, 68, 0.4);
        }
      `}</style>

      <div className=" h-full lg:max-h-[690px] lg:h-[690px]  p-0 lg:overflow-hidden ">
        <DragDropContext 
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            onDragUpdate={onDragUpdate}
        >
          <Droppable droppableId="DELETE_ZONE" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`
                  flex items-center justify-center w-full h-16 mb-4 rounded-lg 
                  transition-all duration-300 ease-in-out
                  ${
                    snapshot.isDraggingOver
                      ? "delete-zone-active border-2 border-red-500"
                      : "bg-slate-800/50 border border-slate-700"
                  }
                `}
              >
                <div
                  className={`
                  flex items-center gap-2 text-slate-400
                  ${snapshot.isDraggingOver ? "text-red-500 scale-110" : ""}
                  transition-all duration-300
                `}
                >
                  <Trash2
                    className={`
                    w-6 h-6
                    ${snapshot.isDraggingOver ? "animate-bounce" : ""}
                  `}
                  />
                  <span className="font-medium">
                    {snapshot.isDraggingOver
                      ? "Release to Delete"
                      : "Drag here to delete"}
                  </span>
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
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
                              {(
                                provided,
                                dragSnapshot: DraggableStateSnapshot
                              ) => (
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
    </>
  );
};






   //   if (!destination) return;
    //   if (destination.droppableId === "DELETE_ZONE") {
    //     const sourceStatus = source.droppableId as TaskStatus;
    //     setTasks((prevTasks) => {
    //       const newTasks = { ...prevTasks };
    //       const sourceColumn = [...newTasks[sourceStatus]];
    //       const [movedTask] = sourceColumn.splice(source.index, 1);
    //       if (!movedTask) {
    //         return prevTasks;
    //       }
    //       newTasks[sourceStatus] = sourceColumn;
    //       if (onDelete) {
    //         onDelete(movedTask._id);
    //       }

    //       return newTasks;
    //     });
    //     return;
    //   }