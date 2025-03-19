"use client"

import { useState, useRef, type FormEvent, type ChangeEvent } from "react"
import { Send, ImageIcon, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Hint from "@/components/Hint"
import { UploadButton } from "@uploadthing/react"
import { useChatStore } from "@/utils/store/use-chat-store"

interface MessageInputProps {
  onSendMessage: (message: { text: string; imageFile?: File | null }) => void
  placeholder?: string
  disabled?: boolean
}

const MessageInput = ({ onSendMessage, placeholder = "Type a message...", disabled = false }: MessageInputProps) => {
  const {editingData} = useChatStore()
  const [text, setText] = useState<string >(editingData?.text || "")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)


  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string) // Set image preview
      }
      reader.readAsDataURL(file) // Read the file as a data URL
      setImageFile(file) // Store the file
    }
  }

  // Remove the selected image
  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = "" // Clear the file input
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!text.trim() && !imageFile) return
    console.log("thi is image : ",imageFile)
    onSendMessage({
      text: text.trim(),
      imageFile: imageFile || null, // Send the image file
    })

    // Clear form
    setText("")
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const canSubmit = text.trim().length > 0 || imageFile !== null

  return (
    <div className="relative ">
      {/* Image Preview */}
      {imagePreview && (
        <div className="absolute bottom-full mb-2 left-0 p-2 bg-background rounded-md border border-border">
          <div className="relative inline-block">
            <Image
              src={imagePreview || "/placeholder.svg"}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-md"
              height={96}
              width={96}
            />
            <Button
              onClick={removeImage}
              size="icon"
              variant="secondary"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              type="button"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
      

      <div className="relative bg-background rounded-lg  shadow-sm">
        <form onSubmit={handleSubmit} className="flex items-center p-1">
          <div className="flex-shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
              disabled={disabled || isUploading}
            />
           <Hint label={isUploading ? "uploading" : "send image"}>
           <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground bg-slate-200 rounded-full hover:text-foreground"
              disabled={disabled || isUploading}
              asChild
            >
              <label htmlFor="file-input" className="cursor-pointer">
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon className="h-5 w-5" />}
              </label>
            </Button>
           </Hint>
          </div>

          <div className="flex-1 mx-1">
            <Input
              type="text"
              className=" bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2"
              placeholder={placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={disabled}
            />
          </div>

          <Button
            type="submit"
            size="icon"
            className={cn("flex-shrink-0   rounded-full", !canSubmit && "opacity-50 cursor-not-allowed")}
            disabled={!canSubmit || disabled}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default MessageInput

