"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { MessageTypeFromServer } from "@/types"
import { UserType } from "../authorize/authorize-user"
import Image from "next/image"
import InfiniteScroll from "react-infinite-scroll-component"
import { cn } from "@/lib/utils"
import MessageBox from "../messages/message"



interface ChatMessagesProps {
  messages: MessageTypeFromServer[]
  isLoading?: boolean
  currentUser ?: UserType | null
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading = false, currentUser}) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null)
    const [seenMessageId, setSeenMessageId] = useState<string | null>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
      <div
              ref={messagesContainerRef} 
              id="scrollableDiv"
              className="text-white w-full h-[calc(100vh-200px)] lg:h-[calc(100vh-180px)] overflow-y-scroll"
            >
              {messages && messages.length !== 0 && (
                <InfiniteScroll
                  dataLength={messages.length}
                  next={() => {}}
                  hasMore={false}
                  loader={<h4 className="text-white">Loading...</h4>}
                  scrollableTarget="scrollableDiv"
                  className="flex flex-col gap-y-4 px-4 py-2"
                >
                  {messages.map((msg: MessageTypeFromServer) => (
                    <div
                      key={msg?._id}
                      className={cn(
                        "flex justify-start",
                        msg?.sender?._id === currentUser?._id ? "justify-end" : ""
                      )}
                    >
                      <MessageBox
                        message={msg}
                        session={currentUser || null}
                        seenMessageId={seenMessageId}
                        setSeenMessageId={setSeenMessageId}
                      />
                    </div>
                  ))}
                </InfiniteScroll>
              )}
            </div>
  )
}

export default ChatMessages

