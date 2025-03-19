"use server";

import { backendUrl, chatBackendUrl } from "@/lib";
import { get_cookies } from "@/lib/get-cookie";
import { Reaction, ReplyToType } from "@/types";
import axios from "axios";

export interface MessageType {
  conversationId: string;
  text?: string;
  senderId: string;
  receiverId ?: string;
  image?: string;
  reactions ?: Reaction[];
  replyTo ?: ReplyToType

}

interface GetMessagesType {
  conversationId: string;
  limit?: number;
  lastID?: string;
}
export const GetConversationAllMessages = async ({
  conversationId,
  limit,
  lastID,
}: GetMessagesType) => {
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const params: Record<string, any> = {
      limit: limit || 10, // Use the provided limit or default to 10
    };

    // Only add lastID to params if it is defined
    if (lastID) {
      params.lastID = lastID;
    }
    const res = await axios.get(
      `${backendUrl}/api/message/all/${conversationId}`,
      {
        withCredentials: true,
        headers: {
          Cookie: `__session=${session_cookie}`,
        },
        params: params,
      }
    );

    if (res.statusText != "OK") {
      return {
        error: "failed to get messages",
      };
    }

    const data = await res.data;

    return {
      message: "successfully got messages",
      msgs: JSON.stringify(data),
    };
  } catch (error) {
    return {
      error: "failed to get messages",
    };
  }
};

export const create_message = async (values: MessageType) => {
  const session_cookie = await get_cookies("chat_session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }
  console.log("i am for creating message : ", values)
  try {
    const res = await axios.post(
      `${chatBackendUrl}/api/chat/message/create`,
      values,
      {
        withCredentials: true,
        headers: {
          Cookie: `chat_session=${session_cookie}`,
          "Content-Type": "application/json",
        },
      }
    );


    const data = await res.data;

    if (!data) {
      return {
        error: "failed to create message",
      };
    }

    return {
      message: "successfully created message",
      msg: JSON.stringify(data.newMessage),
    };
  } catch (error) {
    return {
      error: "failed to send message",
    };
  }
};

export interface MessageEditModelFromClient {
  _id : string,
  senderId : string,
  text : string,
  conversationId : string,
  otherMembers : string[]
}


export const update_message = async (values: MessageEditModelFromClient) => {
  const session_cookie = await get_cookies("chat_session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }
  try {
    const res = await axios.post(
      `${chatBackendUrl}/api/chat/message/update`,
      values,
      {
        withCredentials: true,
        headers: {
          Cookie: `chat_session=${session_cookie}`,
          "Content-Type": "application/json",
        },
      }
    );



    const data = await res.data;

    if (!data) {
      return {
        error: "failed to updated message",
      };
    }

    return {
      message: "successfully updated message",
      updatedMessage : data.successStatus,
    };
  } catch (error) {
    return {
      error: "failed to update message",
    };
  }
};




export const delete_message = async (id : string) => {
  const session_cookie = await get_cookies("chat_session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.delete(
      `${chatBackendUrl}/api/chat/message/delete/${id}`,
      {
        withCredentials: true,
        headers: {
          Cookie: `chat_session=${session_cookie}`,
          "Content-Type": "application/json",
        },
      }
    );



    const data = await res.data;

    if (!data) {
      return {
        error: "failed to delete message",
      };
    }

    return {
      message: "successfully delete message",
      deleteMessage : data.successStatus,
    };
  } catch (error) {
    return {
      error: "failed to delete message",
    };
  }
};