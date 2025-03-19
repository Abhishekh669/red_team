"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SmilePlus } from "lucide-react"
import { cn } from "@/lib/utils"

// Common emojis for reactions
const commonEmojis = ["👍", "❤️", "😂", "😮", "😢", "👏", "🔥", "🎉"]

interface EmojiReactionsProps {
  messageId: string
  reactions?: {
    emoji: string
    count: number
    userReacted: boolean
  }[]
  onAddReaction: (messageId: string, emoji: string) => void
  onRemoveReaction: (messageId: string, emoji: string) => void
}

export default function EmojiReactions({ messageId, reactions, onAddReaction, onRemoveReaction }: EmojiReactionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleEmojiClick = (emoji: string) => {
    const existingReaction = reactions?.find((r) => r.emoji === emoji)

    if (existingReaction?.userReacted) {
      onRemoveReaction(messageId, emoji)
    } else {
      onAddReaction(messageId, emoji)
    }

    setIsOpen(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-1 mt-1">
      {reactions && reactions?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {reactions?.map((reaction) => (
            <Button
              key={reaction.emoji}
              variant="outline"
              size="sm"
              className={cn(
                "h-6 px-2 text-xs rounded-full flex items-center gap-1",
                reaction.userReacted && "bg-primary/10 border-primary/20",
              )}
              onClick={() => handleEmojiClick(reaction.emoji)}
            >
              <span>{reaction.emoji}</span>
              <span className="text-muted-foreground">{reaction.count}</span>
            </Button>
          ))}
        </div>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full" aria-label="Add reaction">
            <SmilePlus className="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex flex-wrap gap-2 max-w-[200px]">
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                className="text-lg hover:bg-muted p-1 rounded cursor-pointer"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

