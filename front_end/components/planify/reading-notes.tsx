"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Star, StarOff } from "lucide-react"

interface ReadingItem {
  id: string
  title: string
  author: string
  completed: boolean
  favorite: boolean
  notes: string
}

export default function ReadingList() {
  const [items, setItems] = useState<ReadingItem[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [newAuthor, setNewAuthor] = useState("")
  const [newNotes, setNewNotes] = useState("")

  useEffect(() => {
    const storedItems = localStorage.getItem("readingList")
    if (storedItems) {
      setItems(JSON.parse(storedItems))
    }
  }, [])

  const addItem = () => {
    if (newTitle.trim() && newAuthor.trim()) {
      const newItem: ReadingItem = {
        id: Date.now().toString(),
        title: newTitle,
        author: newAuthor,
        completed: false,
        favorite: false,
        notes: newNotes,
      }
      const updatedItems = [...items, newItem]
      setItems(updatedItems)
      localStorage.setItem("readingList", JSON.stringify(updatedItems))
      setNewTitle("")
      setNewAuthor("")
      setNewNotes("")
    }
  }

  const toggleItem = (id: string, field: "completed" | "favorite") => {
    const updatedItems = items.map((item) => (item.id === id ? { ...item, [field]: !item[field] } : item))
    setItems(updatedItems)
    localStorage.setItem("readingList", JSON.stringify(updatedItems))
  }

  const deleteItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id)
    setItems(updatedItems)
    localStorage.setItem("readingList", JSON.stringify(updatedItems))
  }

  const updateNotes = (id: string, notes: string) => {
    const updatedItems = items.map((item) => (item.id === id ? { ...item, notes } : item))
    setItems(updatedItems)
    localStorage.setItem("readingList", JSON.stringify(updatedItems))
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reading List</h1>
      <div className="flex flex-col space-y-2 mb-4">
        <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Book/Article Title" />
        <Input value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} placeholder="Author" />
        <Input value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Notes (optional)" />
        <Button onClick={addItem}>Add to Reading List</Button>
      </div>
      <ScrollArea className="h-[calc(100vh-300px)]">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-3 rounded-lg shadow mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => toggleItem(item.id, "completed")}
                  id={item.id}
                />
                <label
                  htmlFor={item.id}
                  className={`font-semibold ${item.completed ? "line-through text-gray-500" : ""}`}
                >
                  {item.title}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => toggleItem(item.id, "favorite")}>
                  {item.favorite ? <Star className="h-4 w-4 text-yellow-500" /> : <StarOff className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">by {item.author}</p>
            <Input
              value={item.notes}
              onChange={(e) => updateNotes(item.id, e.target.value)}
              placeholder="Add notes..."
              className="mt-2"
            />
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

