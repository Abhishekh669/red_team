"use client"
import { Reply, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MessageTypeFromServer } from "@/types"

interface OptionsProps {
  message: MessageTypeFromServer
  onReply?: (message: MessageTypeFromServer) => void
  onEdit?: (message: MessageTypeFromServer) => void
  onDelete?: (messageId: string) => void
  canEdit?: boolean
  canDelete?: boolean
}

function Options({ message, onReply, onEdit, onDelete, canEdit = true, canDelete = true }: OptionsProps) {
  return (
    <div className="flex items-center gap-1  opacity-70 hover:opacity-100 transition-opacity">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onReply?.(message)}
              aria-label="Reply to message"
            >
              <Reply className="h-4 w-4 text-black" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reply</p>
          </TooltipContent>
        </Tooltip>

        {canEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-black"
                onClick={() => onEdit?.(message)}
                aria-label="Edit message"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        )}

        {canDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10"
                onClick={() => onDelete?.(message._id)}
                aria-label="Delete message"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  )
}

export default Options

