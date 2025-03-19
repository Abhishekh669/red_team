"use client";

import type React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Hint from "../Hint";
import { MessageTypeFromServer } from "@/types";
import { UserType } from "../authorize/authorize-user";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Options from "../chat/Options";
import EmojiReactions from "../chat/emoji-reaction";

interface Messages {
  message: MessageTypeFromServer;
  session: UserType | null;
  seenMessageId: string | null;
  setSeenMessageId: (id: string | null) => void;
  replyTo?: {
    _id: string;
    text: string;
    sender: {
      _id: string;
      name: string;
      image: string;
    };
  };
  currentUser: boolean;
  reactions?: { emoji: string; count: number; userReacted: boolean }[];
  onReply: (message: MessageTypeFromServer) => void;
  onEdit: (message : MessageTypeFromServer) => void;
  onDelete: (messageId: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
}

export default function MessageBox({
  message,
  session,
  seenMessageId,
  setSeenMessageId,
  currentUser,
  replyTo,
  reactions,
  onReply,
  onEdit,
  onDelete,
  onAddReaction,
  onRemoveReaction,
}: Messages) {
  console.log("umessage to check : ",message)
  const isSeen = seenMessageId === message?._id;

  const handleToggleSeen = () => {
    setSeenMessageId(isSeen ? null : message?._id);
  };

  return (
    <div className="mt-2 mr-4">
      <div className="relative p-2 group">
        {/* Avatar */}
        <div
          className={cn(
            "absolute top-0",
            message.sender._id === session?._id
              ? "-right-[1.2rem]"
              : "-left-[1rem]"
          )}
        >
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarImage src={message.sender.image} alt={message.sender.name} />
            <AvatarFallback>
              {message.sender.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Date */}
        <div
          className={cn(
            "text-black text-[11px] flex",
            message.sender._id === session?._id
              ? "justify-end pr-2"
              : "justify-start pl-1"
          )}
        >
          {format(new Date(message.createdAt), "MMM d, yyyy")}
        </div>

        {/* Image */}
        {message.replyTo && (
            <div
              className={cn(
                "bg-gray-100 dark:bg-gray-800 relative right-4 rounded-lg p-2 mb-1 max-w-[90%] text-xs",
                currentUser ? "rounded-tr-none self-end" : "rounded-tl-none self-start",
              )}
            >
              <div className="flex items-start gap-1">
                <div className="font-semibold max-w-[200px] truncate text-gray-700 dark:text-gray-300">
                  {message.replyTo.sender._id === session?._id ? "You" : message.replyTo.sender.name}:
                </div>
                <div className="text-gray-600 dark:text-gray-400 truncate max-w-[200px]">{message.replyTo.text}</div>
              </div>
            </div>
          )}
        <div className="">

       
        {message?.image && (
          <div className="relative">
            <Image
              src={message.image}
              alt="image"
              className="size-32 rounded-md mb-1"
              width={300}
              height={300}
            />
          </div>
        )}

        {/* Text */}
        {message.text && (
          <>
          {message?.updatedAt && (
            <Hint label={`Edited at ${format(new Date(message.updatedAt), "MMM d, yyyy, h:mm a")}`}>
              <span className={cn("text-black absolute top-8 max-w-[120px] cursor-auto truncate text-[10px] text-muted-foreground",
              message?.sender?._id === session?._id ? "-left-32" : "-right-32")}>
              Edited at {format(new Date(message.updatedAt), "MMM d, yyyy, h:mm a")}
            </span>
            </Hint>
          )} 

            <div
            className={cn(
              "p-2 rounded-md cursor-pointer bg-white text-black",
              message?.sender._id === session?._id
                ? "bg-rose-400 text-black"
                : "bg-slate-200"
            )}
            onClick={handleToggleSeen}
          >
           
          <p>{message?.text} </p>
          </div>
          </>
        )}
        
        </div>

        {/* Options (Reply, Edit, Delete) */}
        <div
          className={cn(
            "opacity-0 absolute bottom-6 group-hover:opacity-100 transition-opacity",
            currentUser ? "-left-24" : "-right-7"
          )}
        >
          <Options
            message={message}
            onReply={onReply}
            onEdit={currentUser ? onEdit : undefined}
            onDelete={currentUser ? onDelete : undefined}
            canEdit={currentUser}
            canDelete={currentUser}
          />
        </div>

        {/* Emoji Reactions */}
        <div
          className={cn("flex", currentUser ? "justify-end" : "justify-start")}
        >
          <EmojiReactions
            messageId={message._id}
            reactions={reactions}
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
          />
        </div>
      </div>

      {/* Seen By */}
      {message?.sender._id === session?._id && isSeen && (
        <div className="p-1">
          {message?.seenBy.map((u) => (
            <div className="float-end" key={u._id}>
              <Hint label={u.name}>
                <div className="flex gap-x-2 items-center">
                  <span className="text-white text-sm">Seen by</span>
                  <Image
                    src={u.image || ""}
                    className="size-4 border border-white cursor-pointer rounded-full"
                    alt="alt"
                    height={300}
                    width={400}
                  />
                </div>
              </Hint>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
