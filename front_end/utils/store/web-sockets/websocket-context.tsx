// contexts/WebSocketContext.tsx
"use client";
import { useGetSession } from "@/utils/hooks/query-hooks/sessions/use-get-sessions";
import { useGetCookie } from "@/utils/hooks/query-hooks/sessions/use-get-cookie";
import { useEffect, useState, createContext, useContext } from "react";

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
  payload: NewMessageEvent;
};

type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  transport: string;
  messages: NewMessageEvent[];
  sendMessage: (message: string, recipientID: string) => void;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, isLoading: session_loading } = useGetSession();
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<NewMessageEvent[]>([]);

  // Handle incoming WebSocket messages
  const handleIncomingMessage = (event: MessageEvent) => {
    const data: IncomingEvent = JSON.parse(event.data);
    console.log("this is the data from the socket ", data.payload);

    switch (data.type) {
      case "new_message":
        setMessages((prevMessages) => [...prevMessages, data.payload]); // Add new message to the list
        break;
      default:
        console.warn("Unsupported message type:", data);
        break;
    }
  };

  // Initialize WebSocket connection
  useEffect(() => {
    if (session_loading) return;

    const ws = new WebSocket(`ws://localhost:8000/api/ws?userId=${session?.user?._id}`);

    ws.onopen = () => {
      setIsConnected(true);
      setTransport("WebSocket");
      console.log("WebSocket connection established");
    };

    ws.onclose = () => {
      setIsConnected(false);
      setTransport("N/A");
      console.log("WebSocket connection closed");
    };

    ws.onmessage = handleIncomingMessage;

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [session_loading]);

  // Send a message
  const sendMessage = (message: string, recipientID: string) => {
    if (!socket || !message) return;

    const event: Event = {
      type: "send_message",
      payload: JSON.stringify({
        message: message,
        from: session?.user?._id, // Sender's user ID
        to: recipientID, // Recipient's user ID
      }),
    };

    socket.send(JSON.stringify(event));
  };

  return (
    <WebSocketContext.Provider
      value={{ socket, isConnected, transport, messages, sendMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};