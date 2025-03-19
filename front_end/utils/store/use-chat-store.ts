import { create } from "zustand";
import { useSocketIOStore } from "./use-socket-io";
import {
  create_message,
  delete_message,
  GetConversationAllMessages,
  MessageEditModelFromClient,
  MessageType,
  update_message,
} from "@/actions/messages/message";
import {
  get_all_user_conversations,
  get_chat_by_id,
} from "@/actions/chats/chat";
import { MessageTypeFromServer } from "@/types";
import toast from "react-hot-toast";

interface ChatStoreType {
  messages: MessageTypeFromServer[];
  conversations: any[];
  isConversationLoading: boolean;
  isMessagesLoading: boolean;
  subscribeToMessages: () => void;
  getConversations: () => void;
  getMessages: ({
    conversationId,
    limit,
    lastID,
  }: {
    conversationId: string;
    limit?: number;
    lastID?: string;
  }) => void;
  sendMessage: (values: MessageType) => void;
  unsubscribeFromMessages: () => void;
  getChatByID: (id: string) => void;
  ChatInfo: any | null;
  editingData: MessageTypeFromServer | null;
  resetEditData: () => void;
  onReply: (message: MessageTypeFromServer) => void;
  reactions: any;
  replyTo: any;
  resetReplyTo: () => void;
  onEdit: (editData: MessageTypeFromServer) => void;
  onDelete: (id: string) => void;
  onAddReaction: (id: string) => void;
  onRemoveReaction: (id: string) => void;
  isChatInfoLoading: boolean;
  editMessage: (editPayload: MessageEditModelFromClient) => void;
}

const MESSAGE_PER_PAGE = 20;

export const useChatStore = create<ChatStoreType>((set, get) => ({
  messages: [], // Ensure messages is always an array
  replyTo: null,
  editingData: null,
  resetEditData: () => {
    set({ editingData: null });
  },
  resetReplyTo: () => {
    set({ replyTo: null });
  },
  onReply: (message: MessageTypeFromServer) => {
    set({ replyTo: message });
    set({ editingData: null });
  },
  reactions: null,
  onEdit: (editData: MessageTypeFromServer) => {
    if (editData.text) {
      set({ editingData: editData });
      set({ replyTo: null });
    } else {
      toast.error("Image cannot be edited");
      return;
    }
  },
  onDelete: async (id: string) => {
    if(!id){
      toast.error("invalid id ")
      return;
    }

    const res = await delete_message(id);
    if(res.deleteMessage && res.message){
      toast.success("successfully deleted message")
    }else {
      toast.error("failed to delete message")
    }
  },
  onAddReaction: (id: string) => {},
  onRemoveReaction: (id: string) => {},
  conversations: [],
  isConversationLoading: false,
  isMessagesLoading: false,
  ChatInfo: null,
  isChatInfoLoading: false,
  editMessage: async (editPayload: MessageEditModelFromClient) => {
    if (!editPayload._id || !editPayload.conversationId || !editPayload.text) {
      toast.error("Parameter missing");
      return;
    }

    const res = await update_message(editPayload);
    console.log("this is responsein chat store  : ",res)
    if (res.message && res.updatedMessage) {
      set({
        editingData: null,
      });
      toast.success("successfully updated message");
    } else {
      toast.error("failed to update message");
    }

    set({editingData : null})
  },
  getChatByID: async (id: string) => {
    set({ isChatInfoLoading: true });
    const res = await get_chat_by_id(id);
    if (res.message && res.chat) {
      const chatInfo = JSON.parse(res.chat);
      set({ ChatInfo: chatInfo });
    } else if (res.error) {
      toast.error((res.error as string) || "Something went wrong");
    }
    set({ isChatInfoLoading: false });
  },
  getConversations: async () => {
    set({ isConversationLoading: true });
    const res = await get_all_user_conversations();
    if (res.message && res.chats) {
      const chats = JSON.parse(res.chats);
      set({ conversations: chats });
    } else if (res.error) {
      toast.error((res.error as string) || "Something went wrong");
    }
    set({ isConversationLoading: false });
  },
  getMessages: async ({
    conversationId,
    limit = 20,
    lastID = "",
  }: {
    conversationId: string;
    limit?: number;
    lastID?: string;
  }) => {
    set({ isMessagesLoading: true });
    const res = await GetConversationAllMessages({
      conversationId,
      limit,
      lastID,
    });
    if (res.message && res.msgs) {
      const msgs = JSON.parse(res.msgs);
      set({ messages: msgs.messages || [] }); // Ensure messages is always an array
    } else {
      toast.error(res.error || "Something went wrong");
    }
    set({ isMessagesLoading: false });
  },
  sendMessage: async (values: MessageType) => {
    const res = await create_message(values);
    const messages = get().messages || []; // Ensure messages is always an array
    if (res.message && res.msg) {
      const msg = JSON.parse(res.msg);
      set({ messages: [...messages, msg] }); // Spread the array
      set({ replyTo: null });
    } else {
      toast.error(res.error || "Something went wrong");
    }
  },
  subscribeToMessages: () => {
    const { selectedChat, socket } = useSocketIOStore.getState();
    if (!selectedChat || !socket) return;

    socket.on("newMessage", (newMessage: MessageTypeFromServer) => {
      const isMessageFromSelectedConversation =
        newMessage.conversationId === selectedChat;
      if (!isMessageFromSelectedConversation) return;

      const messages = get().messages || []; // Ensure messages is always an array
      set({ messages: [...messages, newMessage] }); // Spread the array
    });
    socket.on("updateMessage",async (newMessage : MessageTypeFromServer)=>{
      const isMessageFromSelectedConversation =
        newMessage.conversationId === selectedChat;
      if (!isMessageFromSelectedConversation) return;
      await get().getMessages({conversationId : selectedChat});
    });

    socket.on("deleteMessage",async (newMessage )=>{
      const isMessageFromSelectedConversation =
      newMessage.conversationId === selectedChat;
    if (!isMessageFromSelectedConversation) return;
    await get().getMessages({conversationId : selectedChat})
      
    })
  },
  unsubscribeFromMessages: () => {
    const socket = useSocketIOStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },
}));
