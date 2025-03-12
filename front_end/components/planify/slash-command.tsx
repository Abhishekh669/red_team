"use client"

import { Extension } from "@tiptap/core"
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion"
import { ReactRenderer } from "@tiptap/react"
import tippy, { Instance } from "tippy.js"
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  ImageIcon,
  Code,
  Quote,
  Table,
  Link,
} from "lucide-react"
import { forwardRef, useEffect, useImperativeHandle, useState, ReactElement } from "react"

interface CommandItem {
  title: string
  icon: ReactElement
  command: ({ editor, range }: { editor: any; range: any }) => void
}

interface CommandListProps {
  items: CommandItem[]
  command: (item: CommandItem) => void
  editor: any
}

interface SlashCommandsOptions {
  suggestion: Omit<SuggestionOptions, "editor">
}

export default Extension.create<SlashCommandsOptions>({
  name: "slashCommands",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }: { editor: any; range: any; props: any }) => {
          props.command({ editor, range })
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          const commands: CommandItem[] = [
            {
              title: "Heading 1",
              icon: <Heading1 className="w-4 h-4" />,
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run()
              },
            },
            {
              title: "Heading 2",
              icon: <Heading2 className="w-4 h-4" />,
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run()
              },
            },
            {
              title: "Heading 3",
              icon: <Heading3 className="w-4 h-4" />,
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run()
              },
            },
            {
              title: "Bullet List",
              icon: <List className="w-4 h-4" />,
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleBulletList().run()
              },
            },
            {
              title: "Numbered List",
              icon: <ListOrdered className="w-4 h-4" />,
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleOrderedList().run()
              },
            },
            {
              title: "Task List",
              icon: <CheckSquare className="w-4 h-4" />,
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleTaskList().run()
              },
            },
            {
              title: "Image",
              icon: <ImageIcon className="w-4 h-4" />,
              command: ({ editor, range }) => {
                const url = window.prompt("Enter the image URL")
                if (url) {
                  editor.chain().focus().deleteRange(range).setImage({ src: url }).run()
                }
              },
            },
            {
              title: "Code Block",
              icon: <Code className="w-4 h-4" />,
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
              },
            },
            {
              title: "Blockquote",
              icon: <Quote className="w-4 h-4" />,
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleBlockquote().run()
              },
            },
            {
              title: "Insert Link",
              icon: <Link className="w-4 h-4" />,
              command: ({ editor, range }) => {
                const url = window.prompt("Enter the URL")
                if (url) {
                  editor.chain().focus().deleteRange(range).setLink({ href: url }).run()
                }
              },
            },
            {
              title: "Table",
              icon: <Table className="w-4 h-4" />,
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
              },
            }
            
          ]

          return commands.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
        },
        render: () => {
          let component: ReactRenderer
          let popup: Instance[]

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
              })

              popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              })
            },
            onUpdate(props: any) {
              component.updateProps(props)

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              })
            },
            onKeyDown(props: any) {
              if (props.event.key === "Escape") {
                popup[0].hide()
                return true
              }
                //@ts-ignore
              return component.ref?.onKeyDown(props)
            },
            onExit() {
              popup[0].destroy()
              component.destroy()
            },
          }
        },
      }),
    ]
  },
})

const CommandList = forwardRef<{ onKeyDown: (event: any) => boolean }, CommandListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]

    if (item) {
      props.command(item)
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler()
        return true
      }

      if (event.key === "ArrowDown") {
        downHandler()
        return true
      }

      if (event.key === "Enter") {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className="bg-white rounded-md shadow-lg border overflow-hidden">
      {props.items.length > 0 ? (
        <div className="p-1">
          {props.items.map((item, index) => (
            <button
              key={index}
              className={`flex items-center space-x-2 w-full px-2 py-1 text-left rounded ${
                index === selectedIndex ? "bg-gray-100" : ""
              }`}
              onClick={() => selectItem(index)}
            >
              <div className="text-gray-500">{item.icon}</div>
              <div>{item.title}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-2 text-sm text-gray-500">No results</div>
      )}
    </div>
  )
})

CommandList.displayName = "CommandList"