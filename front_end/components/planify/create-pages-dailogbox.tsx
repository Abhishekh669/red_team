"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"


// Define schema validation using Zod
const workspaceSchema = z.object({
  title: z.string().min(1, "Workspace title is required"),
  description: z.string().min(5, "must be of 5 character"),
})

export type WorkspaceFormData = z.infer<typeof workspaceSchema>

interface CreateWorkspaceDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreateWorkspace: (workspace: WorkspaceFormData) => void
}

export function CreateWorkspaceDialog({ 
  isOpen, 
  onOpenChange, 
  onCreateWorkspace 
}: CreateWorkspaceDialogProps) {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      title: "",
      description: "",
    }
  })

  const onSubmit = (data: WorkspaceFormData) => {
    onCreateWorkspace(data)
    reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-red-600 text-xl">Create New Workspace</DialogTitle>
            <DialogDescription className="text-slate-400">
              Fill in the details to create your new workspace
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Workspace Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="My Awesome Workspace"
                className="bg-slate-800 border-slate-700 text-white focus:ring-red-600 focus:border-red-600"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Input
                id="description"
                {...register("description")}
                placeholder="A brief description of your workspace"
                className="bg-slate-800 border-slate-700 text-white focus:ring-red-600 focus:border-red-600"
              />
            </div>
            
            
            
            
          </div>
          
          <DialogFooter>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              Create Workspace
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
