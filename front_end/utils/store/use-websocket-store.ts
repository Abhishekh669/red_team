"use client"
import { create } from "zustand";
import { UserType } from "@/components/authorize/authorize-user";
import { MessageTypeFromServer } from "@/types";

type WebSocketStore = {
  socket: WebSocket | null;
  selectedConversation : string | null;
  setSelectedConversation : (id : string) => void;
  isConnected: boolean;
  socketMessages: MessageTypeFromServer | null; 
  session : UserType | null;// Use the appropriate type for your message model
  setSession: (session : UserType) => void;
  initializeWebSocket: (userId : string, conversationId  ?: string) => void;
  sendMessage: (message: MessageTypeFromServer) => void;
};

type Event = {
	type: string;
	payload: string;
};

type NewMessageEvent = {
	message: string;
	from: string;
	to: string;
	sent: string;
};

type IncomingEvent = {
	type: string;
	payload: MessageTypeFromServer;
};


export const useWebSocketStore = create<WebSocketStore>((set, get) => {

  const handleIncomingMessage = (event: MessageEvent) => {
    // const data = JSON.parse(event.data);
    // console.log("Incoming message:", data);

    // if (data.type === "new_message") {
    //   const message = data.payload;
    //    // Parse the message model
    //   set((state) => ({
    //     socketMessages: [...state.socketMessages, message], // Add new message to the list
    //   }));
    // }

    const data : IncomingEvent = JSON.parse(event.data)
    switch (data.type){
      case "new_message":
        const {selectedConversation} = get()
        console.log("this ishte conversation id selected one ", selectedConversation, "this is the conversation id from server : ",data.payload.conversationId)
        if(!selectedConversation || selectedConversation !== data.payload.conversationId)return;
        console.log('this is the supported message : ',data)
        set((state) =>({
          socketMessages :  data.payload
        }))
        break;
      default:
        console.log("this ishte unsupproted message type : ",data)
        console.log("unsupported message type ")
        break;
        
    }
  };

  const initializeWebSocket = (userId : string, conversationId ?: string) => {
    if (!userId) return;

    const ws = new WebSocket(`ws://localhost:8000/api/ws?userId=${userId}`);

    ws.onopen = () => {
      set({ isConnected: true, socket: ws });
      console.log("WebSocket connection established");
    };

    ws.onclose = () => {
      set({ isConnected: false, socket: null });
      console.log("WebSocket connection closed");
    };

    ws.onmessage = handleIncomingMessage;

    set({ socket: ws });
  };

  const sendMessage = (message: MessageTypeFromServer) => {
    const { socket, session } = get();
    if (!socket || !message) return;

    // const event = {
    //   type: "send_message",
    //   payload: JSON.stringify({
    //     message: message,
    //     from: session?._id, // Sender's user ID
    //     to: recipientID, // Recipient's user ID
    //   }),
    // };

    const event = {
      type: "send_message",
      payload: JSON.stringify(message),
    };

    socket.send(JSON.stringify(event));
  };

  return {
    socket: null,
    isConnected: false,
    selectedConversation : null,
    setSelectedConversation :  (conversationId: string) => set({ selectedConversation: conversationId }),
    socketMessages: null,
    initializeWebSocket,
    sendMessage,
    session : null,
    setSession : (session: UserType) => set({session})
  };
});