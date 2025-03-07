import { create_message, GetConversationAllMessages, MessageType } from "@/actions/messages/message";
import { backendUrl, chatBackendUrl } from "@/lib";
import { get_cookies } from "@/lib/get-cookie";
import { MessageTypeFromServer } from "@/types";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { useSocketIOStore } from "./use-socket-io";
import { get_all_user_conversations, get_chat_by_id } from "@/actions/chats/chat";
import { findPositionOfBar } from "recharts/types/util/ChartUtils";

interface ChatStoreType {
  messages: MessageTypeFromServer[];
  conversations: any[];
  isConversationLoading: boolean;
  isMessagesLoading: boolean;
  subscribeToMessages : () => void; 
  getConversations : () => void;
  getMessages : ({conversationId, limit, lastID} : {conversationId : string, limit ?: number, lastID ?: string}) => void;
  sendMessage  : (values : MessageType) => void;
  unsubscribeFromMessages : () => void;
  getChatByID : (id : string) => void;
  ChatInfo : any | null;

  isChatInfoLoading : boolean,

}

const MESSAGE_PER_PAGE=20;

export const useChatStore = create<ChatStoreType>((set, get) => ({
  messages: [],
  conversations: [],
  isConversationLoading: false,
  isMessagesLoading: false,
  ChatInfo : null,
  isChatInfoLoading : false,
  getChatByID : async (id : string) =>{
    set({isChatInfoLoading : true})
    
    const res = await get_chat_by_id(id);
    if(res.message && res.chat){
      const chatInfo = JSON.parse(res.chat);
      set({ChatInfo : chatInfo})
    }
      else{
        toast.error(res.error || "something went wrong")
    }

    set({isChatInfoLoading : false})
    

  },
  getConversations: async () => {
    set({ isConversationLoading: true });
    const res = await get_all_user_conversations();
    if(res.message && res.chats){
      const chats = JSON.parse(res.chats);
      set({conversations : chats})
    }
    else{
      toast.error(res.error || "something went wrong")
    }
    set({isConversationLoading : false})
  },

  getMessages : async ({conversationId, limit=20, lastID=""} : {conversationId : string, limit ?: number, lastID ?: string}) =>{
    set({isMessagesLoading : true});
    const res = await GetConversationAllMessages({conversationId, limit, lastID});
    if(res.message && res.msgs){
      const msgs = JSON.parse(res.msgs);
      set({messages : msgs.messages})
    }
    else{
      toast.error(res.error || "something went wrong")
    }
  set({isMessagesLoading : false});
    
  },
  sendMessage : async (values : MessageType) =>{
    const res = await create_message(values);
    if(res.message && res.msg){
      const msg = JSON.parse(res.msg)
      set({messages : [...get().messages, msg]})
    }else{
      toast.error(res.error || "something went wrong")
    }
  },

  subscribeToMessages : () =>{
    const {selectedChat, socket} = useSocketIOStore.getState();
    console.log("i am in hte subscrible to messages : ")
    if(!selectedChat || !socket) return;
    console.log("this is me ")
    socket.on("newMessage", (newMessage : MessageTypeFromServer)=>{
        const isMessageFromSelectedConversation = newMessage.conversationId === selectedChat;
        console.log("New messgae conversation id : ",newMessage.conversationId, "selected chat : ", selectedChat)
        if(!isMessageFromSelectedConversation)return;
        console.log(JSON.stringify(newMessage))

        set({
            messages : [...get().messages, newMessage],
        })

    })

  },

  unsubscribeFromMessages : () =>{
    const socket = useSocketIOStore.getState().socket;
    if(!socket)return;
    socket?.off("newMessage");
  }
}));
