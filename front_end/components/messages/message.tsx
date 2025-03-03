"use client";

import type React from "react";

import Image from "next/image";
import { cn } from "@/lib/utils";
import Hint from "../Hint";
import { MessageTypeFromServer } from "@/types";
import { UserType } from "../authorize/authorize-user";

interface Messages {
  message: MessageTypeFromServer;
  session: UserType;
  seenMessageId: string | null;
  setSeenMessageId: (id: string | null) => void;
}

export default function MessageBox({
  message,
  session,
  seenMessageId,
  setSeenMessageId,
}: Messages) {
  const isSeen = seenMessageId === message?._id;

  const handleToggleSeen = () => {
    setSeenMessageId(isSeen ? null : message?._id);
  };

  return (
    <div>
      <div
        className={cn("p-2 rounded-md cursor-pointer bg-white text-black ",
            message?.sender._id === session?._id ? " bg-rose-400 text-white" : ""
        )}
        onClick={handleToggleSeen}
      >
        {message?.body}
      </div>

      {message?.sender._id === session?._id && isSeen && (
        <div className="p-1">
          {message?.seenBy.map((u) => (
            <div className="float-end" key={u._id}>
              <Hint label={u.name}>
                <div className="flex gap-x-2 items-center">
                <span className="text-white text-sm">Seen by</span>
                <Image
                  src={u.image || ""}
                  className="size-4  border border-white cursor-pointer rounded-full"
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
