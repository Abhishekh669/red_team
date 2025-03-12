"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Trash2, Edit } from "lucide-react"
import NotionEditor from "./notion-editor"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog" // Import Dialog components

interface JournalEntry {
  id: string
  date: string
  content: string
  title: string
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false) // State to control dialog visibility
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null) // Track the entry being edited/deleted

  useEffect(() => {
    const storedEntries = localStorage.getItem("journalEntries")
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries))
    }
  }, [])

  const addNewEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      content: "",
      title: "New Entry",
    }
    const updatedEntries = [newEntry, ...entries]
    setEntries(updatedEntries)
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries))
    setSelectedEntry(newEntry)
  }

  const updateEntry = (content: string) => {
    if (selectedEntry) {
      const updatedEntries = entries.map((entry) =>
        entry.id === selectedEntry.id ? { ...entry, content } : entry
      )
      setEntries(updatedEntries)
      localStorage.setItem("journalEntries", JSON.stringify(updatedEntries))
    }
  }

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries))
    if (selectedEntry?.id === id) {
      setSelectedEntry(null)
    }
    setIsDialogOpen(false) // Close the dialog after deletion
  }

  const updateEntryTitle = (id: string, newTitle: string) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === id ? { ...entry, title: newTitle } : entry
    )
    setEntries(updatedEntries)
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries))
    if (selectedEntry?.id === id) {
      setSelectedEntry({ ...selectedEntry, title: newTitle })
    }
  }

  const handleEdit = (id: string) => {
    const entryToEdit = entries.find((entry) => entry.id === id)
    if (entryToEdit) {
      setSelectedEntry(entryToEdit)
    }
    setIsDialogOpen(false) // Close the dialog after editing
  }

  return (
    <div className="p-4 h-full flex">
      <div className="w-1/3 pr-4 border-r">
        <h1 className="text-2xl font-bold mb-4">Journal</h1>
        <Button onClick={addNewEntry} className="mb-4">
          New Entry
        </Button>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`p-3 rounded-lg mb-3 cursor-pointer ${
                selectedEntry?.id === entry.id ? "bg-blue-100" : "bg-white"
              }`}
              onClick={() => setSelectedEntry(entry)}
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">{entry.title}</p>
                <Dialog open={isDialogOpen && currentEntryId === entry.id} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentEntryId(entry.id) // Set the current entry ID
                        setIsDialogOpen(true) // Open the dialog
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Actions</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4">
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(entry.id)} // Handle edit action
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => deleteEntry(entry.id)} // Handle delete action
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-sm text-gray-600">{entry.date}</p>
              <p className="text-sm text-gray-600 truncate">{entry.content}</p>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="w-2/3 pl-4">
        {selectedEntry ? (
          <>
            <Input
              type="text"
              value={selectedEntry.title}
              onChange={(e) => updateEntryTitle(selectedEntry.id, e.target.value)}
              className="text-2xl font-bold mb-4 w-full bg-transparent border-none outline-none"
              placeholder="Enter a title"
            />
            <NotionEditor initialContent={selectedEntry.content} onUpdate={updateEntry} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select an entry or create a new one
          </div>
        )}
      </div>
    </div>
  )
}