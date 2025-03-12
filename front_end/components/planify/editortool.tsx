"use client"

import type { Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  CheckSquare,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Hint from "../Hint"

interface EditorToolbarProps {
  editor : Editor
  onUpdate ?: (content : string) => void;
}
export default function EditorToolbar({ editor, onUpdate }: EditorToolbarProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const addLink = () => {
    if (!editor) return; // Ensure editor exists
  
    const { state } = editor;
    const { from, to } = state.selection;
  
    if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    } else {
      return; // Prevent adding an empty link
    }
  
    // If no text is selected, insert the link with the URL as the text
    if (from === to) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${linkUrl}" target="_blank">${linkUrl}</a>`)
        .run();
    }
  
    // Manually trigger the onUpdate function
    const updatedContent = editor.getHTML();
  
    if (onUpdate) {
      onUpdate(updatedContent);
    }
  
    setLinkUrl(""); // Reset input field
  };
  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl("")
    }
  }

 
  return (
    <div className="border-b p-2 flex flex-wrap gap-1 text-white items-center">
      {/* Bold */}
      <Hint label="bold">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      </Hint>

      {/* Italic */}
      <Hint label="italic">
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      </Hint>
      {/* Underline */}
      <Hint label="underline">
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        aria-label="Underline"
      >
        <Underline className="h-4 w-4" />
      </Toggle>
      </Hint>

      {/* Strikethrough */}
      <Hint label="strikethrough ">
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      </Hint>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Headings */}
     <Hint label="heading 1">
     <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        aria-label="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
     </Hint>

      <Hint label="heading 2">
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        aria-label="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      </Hint>

     <Hint label="heading 3">
     <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 3 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        aria-label="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>
     </Hint>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Bullet List */}
      <Hint label="bullet list">
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => {
          console.log("Toggling bullet list") // Debugging log
          editor.chain().focus().toggleBulletList().run()
        }}
        aria-label="Bullet List"
      >
        <List className="h-4 w-4" />
      </Toggle>
      </Hint>

      {/* Ordered List */}
      <Hint label="number list">
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => {
          console.log("Toggling ordered list") // Debugging log
          editor.chain().focus().toggleOrderedList().run()
        }}
        aria-label="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      </Hint>

      {/* Task List */}
     <Hint label="task list">
     <Toggle
        size="sm"
        pressed={editor.isActive("taskList")}
        onPressedChange={() => {
          console.log("Toggling task list") // Debugging log
          editor.chain().focus().toggleTaskList().run()
        }}
        aria-label="Task List"
      >
        <CheckSquare className="h-4 w-4" />
      </Toggle>

     </Hint>
      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Link */}
     
     <Popover>
        <PopoverTrigger asChild>
        <Hint label="insert link">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <LinkIcon className="h-4 w-4" />
          </Button>
          </Hint>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Insert Link</h3>
            <Input placeholder="https://example.com" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />

            <Button size="sm" onClick={addLink}>
              {editor.isActive("link") ? "Update Link" : "Add Link"}
            </Button>
            {editor.isActive("link") && (
              <Button variant="outline" size="sm" onClick={() => editor.chain().focus().unsetLink().run()}>
                Remove Link
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
     

      {/* Image */}
      <Popover>
        <PopoverTrigger asChild>
          <Hint label="insert image">

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ImageIcon className="h-4 w-4" />
          </Button>
          </Hint>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Insert Image</h3>
            <Input
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button size="sm" onClick={addImage}>
              Add Image
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Undo */}
     <div>
     <Hint
      label="undo"
     >
     <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="h-8 w-8 p-0"
      >
        <Undo className="h-4 w-4" />
      </Button>
     </Hint>

      {/* Redo */}
     <Hint label="redo">
     <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="h-8 w-8 p-0"
      >
        <Redo className="h-4 w-4" />
      </Button>
     </Hint>
     </div>
    </div>
  )
}