"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Star, StarOff, BookOpen, Plus, ListTodo, BookMarked } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { QuickTaskType } from "@/types"
import { useCreateQuickTask } from "@/utils/hooks/mutate-hooks/planify/quicktask/use-create-quick-task"
import toast from "react-hot-toast"
import { useGetUserQuickTasks } from "@/utils/hooks/query-hooks/planify/quick-tasks/use-get-quick-tasks"
import { useToggleQuickTask } from "@/utils/hooks/mutate-hooks/planify/quicktask/use-toggle-quick-task"
import { useDeleteQuickTask } from "@/utils/hooks/mutate-hooks/planify/quicktask/use-delete-quick-task"

// Update the QuickTaskType interface to make author and notes optional


export default function ReadingList() {
  const [items, setItems] = useState<QuickTaskType[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [newAuthor, setNewAuthor] = useState("")
  const [newNotes, setNewNotes] = useState("")
  const [newType, setNewType] = useState<"book" | "todo">("book")
  const [activeTab, setActiveTab] = useState("all")
  const {mutate : createQuickTask, isPending : creating} = useCreateQuickTask()
  const {data : quickTasks, isLoading : tasksLoading} = useGetUserQuickTasks();
  const {mutate : toggleQuickTasks, isPending : toggleing} = useToggleQuickTask();
  const {mutate : delete_task, isPending : deleting} = useDeleteQuickTask()

  useEffect(()=>{
    if(tasksLoading)return
    if(quickTasks?.quickTasks){
      setItems(quickTasks.quickTasks)
    }
  },[tasksLoading, quickTasks?.quickTasks])

 

  // In the addItem function, modify to handle different types
  const addItem = () => {
    if(creating)return;
    if (newTitle.trim()) {
      const newItem: Omit<QuickTaskType, "_id" | "createdAt"> = {
        title: newTitle,
        completed: false,
        favorite: false,
        type: newType,
      }

      // Only add author and notes for books
      if (newType === "book") {
        newItem.author = newAuthor
        newItem.notes = newNotes
      }

      createQuickTask(newItem,{
        onSuccess: (res) => {
          if (res.message && res.status) {
            toast.success(res.message);
          } else if(res.error) {
            toast.error(res.error);
          }
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create task");
        },
      })


      setNewTitle("")
      setNewAuthor("")
      setNewNotes("")
    }
  }

  const toggleItem = (_id: string, field: "completed" | "favorite", status : boolean) => {
    if(tasksLoading || creating || deleting)return;
    const data = {
      field ,
      status,
      _id
    }


    toggleQuickTasks(data,{
      onSuccess: (res) => {
        if (res.message && res.status) {
          toast.success(res.message);
        } else if(res.error) {
          toast.error(res.error);
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to toggle task");
      },
    })
    

  }

  const deleteItem = (_id: string) => {
    if(tasksLoading || creating || deleting)return;
    delete_task(_id,{
      onSuccess: (res) => {
        if (res.message && res.status) {
          toast.success(res.message);
        } else if(res.error) {
          toast.error(res.error);
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete task");
      },
    })
    
  }

  const updateNotes = (_id: string, notes: string) => {
  }

  const filteredItems = items.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "books") return item.type === "book"
    if (activeTab === "todos") return item.type === "todo"
    return true
  })

  const bookCount = items.filter((item) => item.type === "book").length
  const todoCount = items.filter((item) => item.type === "todo").length

  console.log("this is items : ",quickTasks)

  return (
    <div className="min-h-screen bg-black p-6">
      <Card className="max-w-2xl mx-auto bg-slate-950 border-red-600/20 shadow-lg shadow-red-600/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl font-bold text-white">Reading & Task List</h1>
          </div>

          {/* Update the form section to conditionally show fields based on type */}
          <div className="space-y-4 mb-6 bg-black/40 p-4 rounded-lg border border-slate-800">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Add New Item</h2>
            <div className="grid gap-3">
              <RadioGroup
                defaultValue="book"
                value={newType}
                onValueChange={(value) => setNewType(value as "book" | "todo")}
                className="flex gap-4 mb-2 "
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="book" id="book" className="border-slate-700 text-red-600  checked:bg-red-600" />
                  <Label htmlFor="book" className="text-white flex items-center gap-1">
                    <BookMarked className="h-4 w-4 text-red-600" />
                    Book
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="todo" id="todo" className="border-slate-700 text-red-600 checked:bg-red-600" />
                  <Label htmlFor="todo" className="text-white flex items-center gap-1">
                    <ListTodo className="h-4 w-4 text-red-600" />
                    Todo
                  </Label>
                </div>
              </RadioGroup>

              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={newType === "book" ? "Book/Article Title" : "Task Content"}
                className="bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-red-600/50 focus:ring-red-600/10"
              />

              {newType === "book" && (
                <>
                  <Input
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Author"
                    className="bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-red-600/50 focus:ring-red-600/10"
                  />
                  <Input
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Notes (optional)"
                    className="bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-red-600/50 focus:ring-red-600/10"
                  />
                </>
              )}

              <Button
                onClick={addItem}
                className="bg-red-600 hover:bg-red-700 text-white w-full flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add {newType === "book" ? "Book" : "Task"}
              </Button>
            </div>
          </div>

          <Separator className="my-6 bg-slate-800" />

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-black/60 border border-slate-800">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-slate-400"
                >
                  All
                  <Badge className="ml-2 bg-slate-800 text-white hover:bg-slate-800">{items.length}</Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="books"
                  className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-slate-400"
                >
                  Books
                  <Badge className="ml-2 bg-slate-800 text-white hover:bg-slate-800">{bookCount}</Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="todos"
                  className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-slate-400"
                >
                  Todos
                  <Badge className="ml-2 bg-slate-800 text-white hover:bg-slate-800">{todoCount}</Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <ScrollArea className="h-[calc(100vh-500px)] pr-4">
                <div className="space-y-3">
                  {filteredItems && filteredItems.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <p>Your list is empty</p>
                      <p className="text-xs mt-1">Add some items to get started</p>
                    </div>
                  ) : (
                    // Update the card rendering for the "all" tab to handle different types
                    filteredItems.map((item) => (
                      <Card
                        key={item._id}
                        className={`bg-black border-slate-800 hover:border-red-600/30 transition-all duration-200 ${
                          item.completed ? "opacity-70" : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="pt-0.5">
                                <Checkbox
                                  checked={item.completed}
                                  onCheckedChange={() => toggleItem(item._id, "completed", item.completed)}
                                  id={item._id}
                                  className="border-slate-700 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                                />
                              </div>
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <label
                                    htmlFor={item._id}
                                    className={`font-medium block ${
                                      item.completed ? "line-through text-slate-500" : "text-white"
                                    }`}
                                  >
                                    {item.title}
                                  </label>
                                  <Badge
                                    className={`${
                                      item.type === "book"
                                        ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/30"
                                        : "bg-green-900/30 text-green-400 hover:bg-green-900/30"
                                    }`}
                                  >
                                    {item.type === "book" ? (
                                      <BookMarked className="h-3 w-3 mr-1" />
                                    ) : (
                                      <ListTodo className="h-3 w-3 mr-1" />
                                    )}
                                    {item.type === "book" ? "Book" : "Todo"}
                                  </Badge>
                                </div>

                                {item.type === "book" && (
                                  <>
                                    {item.author && <p className="text-sm text-slate-400">by {item.author}</p>}
                                    <Input
                                      value={item.notes || ""}
                                      onChange={(e) => updateNotes(item._id, e.target.value)}
                                      placeholder="Add notes..."
                                      className="mt-2 bg-slate-900 border-slate-800 text-white placeholder-slate-500 text-sm focus:border-red-600/50 focus:ring-red-600/10"
                                    />
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleItem(item._id, "favorite", item.favorite)}
                                className="h-8 w-8 text-slate-400 hover:text-yellow-500 hover:bg-slate-900"
                              >
                                {item.favorite ? (
                                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                ) : (
                                  <StarOff className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteItem(item._id)}
                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-slate-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="books" className="mt-0">
              <ScrollArea className="h-[calc(100vh-500px)] pr-4">
                <div className="space-y-3">
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <p>No books in your list</p>
                      <p className="text-xs mt-1">Add some books to get started</p>
                    </div>
                  ) : (
                    // Update the books tab content to show all fields
                    filteredItems.map((item) => (
                      <Card
                        key={item._id}
                        className={`bg-black border-slate-800 hover:border-red-600/30 transition-all duration-200 ${
                          item.completed ? "opacity-70" : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="pt-0.5">
                                <Checkbox
                                  checked={item.completed}
                                  onCheckedChange={() => toggleItem(item._id, "completed", item.completed)}
                                  id={`book-${item._id}`}
                                  className="border-slate-700 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                                />
                              </div>
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <label
                                    htmlFor={`book-${item._id}`}
                                    className={`font-medium block ${
                                      item.completed ? "line-through text-slate-500" : "text-white"
                                    }`}
                                  >
                                    {item.title}
                                  </label>
                                  <Badge className="bg-blue-900/30 text-blue-400 hover:bg-blue-900/30">
                                    <BookMarked className="h-3 w-3 mr-1" />
                                    Book
                                  </Badge>
                                </div>
                                {item.author && <p className="text-sm text-slate-400">by {item.author}</p>}
                                <Input
                                  value={item.notes || ""}
                                  onChange={(e) => updateNotes(item._id, e.target.value)}
                                  placeholder="Add notes..."
                                  className="mt-2 bg-slate-900 border-slate-800 text-white placeholder-slate-500 text-sm focus:border-red-600/50 focus:ring-red-600/10"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleItem(item._id, "favorite",item.favorite)}
                                className="h-8 w-8 text-slate-400 hover:text-yellow-500 hover:bg-slate-900"
                              >
                                {item.favorite ? (
                                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                ) : (
                                  <StarOff className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteItem(item._id)}
                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-slate-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="todos" className="mt-0">
              <ScrollArea className="h-[calc(100vh-500px)] pr-4">
                <div className="space-y-3">
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <p>No todos in your list</p>
                      <p className="text-xs mt-1">Add some tasks to get started</p>
                    </div>
                  ) : (
                    // Update the todos tab content to show simplified cards
                    filteredItems.map((item) => (
                      <Card
                        key={item._id}
                        className={`bg-black border-slate-800 hover:border-red-600/30 transition-all duration-200 ${
                          item.completed ? "opacity-70" : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3 flex-1">
                              <Checkbox
                                checked={item.completed}
                                onCheckedChange={() => toggleItem(item._id, "completed",item.completed)}
                                id={`todo-${item._id}`}
                                className="border-slate-700 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                              />
                              <div className="flex items-center gap-2">
                                <label
                                  htmlFor={`todo-${item._id}`}
                                  className={`font-medium ${
                                    item.completed ? "line-through text-slate-500" : "text-white"
                                  }`}
                                >
                                  {item.title}
                                </label>
                                <Badge className="bg-green-900/30 text-green-400 hover:bg-green-900/30">
                                  <ListTodo className="h-3 w-3 mr-1" />
                                  Todo
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleItem(item._id, "favorite", item.favorite)}
                                className="h-8 w-8 text-slate-400 hover:text-yellow-500 hover:bg-slate-900"
                              >
                                {item.favorite ? (
                                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                ) : (
                                  <StarOff className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteItem(item._id)}
                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-slate-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

