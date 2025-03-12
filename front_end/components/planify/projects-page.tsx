"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar" // Import shadcn Calendar
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover" // Import Popover for Calendar
import { format } from "date-fns" // For formatting dates

interface Project {
  id: string
  name: string
  status: "Not Started" | "In Progress" | "Completed"
  deadline: string
  description: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState("")
  const [newDeadline, setNewDeadline] = useState<Date | undefined>(undefined) // Use Date for shadcn Calendar
  const [newDescription, setNewDescription] = useState("")

  useEffect(() => {
    const storedProjects = localStorage.getItem("projects")
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects))
    }
  }, [])

  const addProject = () => {
    if (newProject.trim()) {
      const newProjectObj: Project = {
        id: Date.now().toString(),
        name: newProject,
        status: "Not Started",
        deadline: newDeadline ? format(newDeadline, "yyyy-MM-dd") : new Date().toISOString().split("T")[0],
        description: newDescription,
      }
      const updatedProjects = [...projects, newProjectObj]
      setProjects(updatedProjects)
      localStorage.setItem("projects", JSON.stringify(updatedProjects))
      setNewProject("")
      setNewDeadline(undefined)
      setNewDescription("")
    }
  }

  const updateProjectStatus = (id: string, status: Project["status"]) => {
    const updatedProjects = projects.map((project) => (project.id === id ? { ...project, status } : project))
    setProjects(updatedProjects)
    localStorage.setItem("projects", JSON.stringify(updatedProjects))
  }

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter((project) => project.id !== id)
    setProjects(updatedProjects)
    localStorage.setItem("projects", JSON.stringify(updatedProjects))
  }

  const isOverdue = (date: string) => {
    return new Date(date) < new Date(new Date().toDateString())
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-white">Projects</h1>
      <div className="flex flex-col space-y-2 mb-4">
        <Input
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          placeholder="Project name"
          className="bg-white"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-white">
              {newDeadline ? format(newDeadline, "PPP") : "Select deadline"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={newDeadline}
              onSelect={setNewDeadline}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
        <Input
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Project description"
          className="bg-white"
        />
        <Button onClick={addProject} className="bg-blue-600 text-white hover:bg-blue-700">
          Add Project
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-300px)]">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-gray-800 p-4 rounded-lg shadow mb-3 hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">{project.name}</h3>
              <Button variant="ghost" size="sm" onClick={() => deleteProject(project.id)}>
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
            <p className="text-sm text-gray-300 mb-2">{project.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm ${isOverdue(project.deadline) && project.status !== "Completed" ? "text-red-600" : "text-white"}`}
                >
                  Deadline: {project.deadline}
                </span>
                {isOverdue(project.deadline) && project.status !== "Completed" && (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <Select
                value={project.status}
                onValueChange={(value) => updateProjectStatus(project.id, value as Project["status"])}
              >
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}