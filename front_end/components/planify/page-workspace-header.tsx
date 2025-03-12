"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface WorkspaceHeaderProps {
  onCreateClick: () => void
}

export function WorkspaceHeader({ onCreateClick }: WorkspaceHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-red-600">My Pages Workspaces</h1>

      <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={onCreateClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Workspace
      </Button>
    </div>
  )
}

