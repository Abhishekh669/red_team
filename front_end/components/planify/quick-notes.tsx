"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2 } from "lucide-react"

interface QuickNote {
  id: string
  content: string
  date: string
}

export default function QuickNotes() {
  const [notes, setNotes] = useState<QuickNote[]>([])
  const [newNote, setNewNote] = useState("")

  useEffect(() => {
    const storedNotes = localStorage.getItem("quickNotes")
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes))
    }
  }, [])

  const addNote = () => {
    if (newNote.trim()) {
      const newNoteObj: QuickNote = {
        id: Date.now().toString(),
        content: newNote,
        date: new Date().toLocaleString(),
      }
      const updatedNotes = [newNoteObj, ...notes]
      setNotes(updatedNotes)
      localStorage.setItem("quickNotes", JSON.stringify(updatedNotes))
      setNewNote("")
    }
  }

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
    localStorage.setItem("quickNotes", JSON.stringify(updatedNotes))
  }

  return (
    <div className="p-4 max-w-2xl mx-auto bg-black rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-white">Quick Notes</h1>
      <div className="flex space-x-2 mb-4">
        <Input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a quick note..."
          onKeyPress={(e) => e.key === "Enter" && addNote()}
          className="bg-slate-950 text-white placeholder-gray-400"
        />
        <Button onClick={addNote} className="bg-blue-600 text-white hover:bg-blue-700">
          Add
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-gray-900 p-3 rounded-lg shadow mb-3 flex justify-between items-start hover:bg-gray-600 transition-colors"
          >
            <div>
              <p className="text-sm text-gray-300 mb-1">{note.date}</p>
              <p className="text-white">{note.content}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)}>
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}