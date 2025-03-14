"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Code,
  Link2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SlashCommands from "./slash-command";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import EditorToolbar from "./editortool";
import { useGetPageById } from "@/utils/hooks/query-hooks/planify/pages/use-get-page-by-id";
import { usePageId } from "@/utils/use-page-id";
import { useUpdatePageData } from "@/utils/hooks/mutate-hooks/planify/pages/use-update-page-data";

interface NotionEditorProps {
  initialContent?: string;
  initialTitle?: string;
  onUpdate?: (content: string) => void; // Make onUpdate optional
}

export default function NotionEditor({
  initialContent = "",
  initialTitle = "Untitled",
  onUpdate = () => {}, // Provide a default function
}: NotionEditorProps) {
  const id = usePageId();
  const { data: pageData, isLoading: pageDataLoading } = useGetPageById(id);
  const { mutate: update_page_data, isPending: updating } = useUpdatePageData();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4", // Customize bullet list styling
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4", // Customize ordered list styling
          },
        },
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full rounded-md my-4",
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: "not-prose pl-2",
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "flex items-start my-1",
        },
      }),
      Placeholder.configure({
        placeholder: 'Type "/" for commands...',
        emptyEditorClass:
          "cursor-text before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:pointer-events-none",
      }),
      Underline,
      SlashCommands,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();
      console.log("this is updated content : ", updatedContent);
      setContent(updatedContent);
      onUpdate(updatedContent);
    },
  });

  const savePage = useCallback(() => {
    if (!id) return;
    console.log("i am updating : ", content);
    update_page_data({
      _id: id,
      title,
      content,
    });
  }, [id, title, content, update_page_data]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        savePage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [savePage]);

  useEffect(() => {
    if (pageDataLoading) return;
    if (pageData?.pageData) {
      setTitle(pageData?.pageData.title);
      if (pageData?.pageData?.content) {
        setContent(pageData?.pageData.content);
        editor?.commands.setContent(pageData?.pageData.content);
      }
    }
  }, [pageData?.pageData, pageDataLoading]);

  if (!editor) {
    return null;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto bg-black text-white">
      <Button
        onClick={()=>router.back()}
      >
        <ArrowLeft /> Go Back
      </Button>

      <div className="flex items-center justify-center  gap-2">
        <span className="text-lg font-medium text-white">Title:</span>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-[30px] font-bold text-red-600 w-auto h-[40px] border-none outline-none placeholder-gray-400 bg-transparent"
          placeholder="Untitled"
        />
      </div>
      {/* Integrate the EditorToolbar */}
      {editor && <EditorToolbar editor={editor} onUpdate={onUpdate} />}

      {/* Wrapper for EditorContent and BubbleMenu */}
      <div className="relative group">
        {editor && (
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100 }}
            className="bg-gray-800 shadow-lg border rounded-lg overflow-hidden flex transition-opacity opacity-0 group-hover:opacity-100" // Show on hover
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-1 h-8 w-8",
                editor.isActive("bold") && "bg-gray-700"
              )}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-1 h-8 w-8",
                editor.isActive("italic") && "bg-gray-700"
              )}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-1 h-8 w-8",
                editor.isActive("link") && "bg-gray-700"
              )}
              onClick={() => {
                const url = window.prompt("Enter the URL");
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                } else {
                  editor.chain().focus().unsetLink().run();
                }
              }}
            >
              <Link2 className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-1 h-8 w-8",
                editor.isActive("underline") && "bg-gray-700"
              )}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-1 h-8 w-8",
                editor.isActive("strike") && "bg-gray-700"
              )}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-1 h-8 w-8",
                editor.isActive("code") && "bg-gray-700"
              )}
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <Code className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-1 h-8 w-8",
                editor.isActive("heading", { level: 1 }) && "bg-gray-700"
              )}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <Heading1 className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-1 h-8 w-8",
                editor.isActive("heading", { level: 2 }) && "bg-gray-700"
              )}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <Heading2 className="h-4 w-4 text-white" />
            </Button>
          </BubbleMenu>
        )}

        <EditorContent
          editor={editor}
          className="prose w-full prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none text-white"
        />
      </div>
    </div>
  );
}
