// "use client";

import Conversations from "@/components/chat/conversations";
import { Freckle_Face } from "next/font/google";

// import { useGetSession } from "@/utils/hooks/query-hooks/sessions/use-get-sessions";
// import { useEffect, useState } from "react";
// import { useGetCookie } from "@/utils/hooks/query-hooks/sessions/use-get-cookie";

// type Event = {
// 	type: string;
// 	payload: string;
// };

// type NewMessageEvent = {
// 	message: string;
// 	from: string;
// 	to: string;
// 	sent: string;
// };

// type IncomingEvent = {
// 	type: string;
// 	payload: NewMessageEvent;
// };

// export default function Home() {
// 	const { data: session, isLoading: session_loading } = useGetSession();
// 	const [_isConnected, setIsConnected] = useState(false);
// 	const [_transport, setTransport] = useState("N/A");
// 	const [recipientID, setRecipientID] = useState("");
// 	const [message, setMessage] = useState("");
// 	const [socket, setSocket] = useState<WebSocket | null>(null);
// 	const [messages, setMessages] = useState<NewMessageEvent[]>([]); // Store received messages
// 	const {  isLoading: cookie_loading } = useGetCookie("__session");

// 	// Handle incoming WebSocket messages
// 	const handleIncomingMessage = (event: MessageEvent) => {
// 		const data: IncomingEvent= JSON.parse(event.data);

// 		switch (data.type) {	
// 			case "new_message":
				
// 				setMessages((prevMessages) => [...prevMessages, data.payload]); // Add new message to the list
// 				break;
// 			default:
// 				console.warn("Unsupported message type:", data);
// 				break;
// 		}
// 	};

// 	useEffect(() => {
// 		if (session_loading || cookie_loading) return;

// 		// Create a WebSocket connection
// 		const ws = new WebSocket(`ws://localhost:8000/api/ws?userId=${session?.user?._id}`);

// 		// Handle connection open
// 		ws.onopen = () => {
// 			setIsConnected(true);
// 			setTransport("WebSocket");
// 			console.log("WebSocket connection established");
// 		};

// 		// Handle connection close
// 		ws.onclose = () => {
// 			setIsConnected(false);
// 			setTransport("N/A");
// 			console.log("WebSocket connection closed");
// 		};

// 		// Handle incoming messages
// 		ws.onmessage = handleIncomingMessage;

// 		// Store the WebSocket instance
// 		setSocket(ws);

// 		// Clean up the WebSocket connection
// 		return () => {
// 			ws.close();
// 		};
// 	}, [session_loading, cookie_loading, session?.user?._id]);

// 	// Send a message
// 	const sendMessage = () => {
// 		if (!socket || !message) return;

// 		// Create a send_message event
// 		const event: Event = {
// 			type: "send_message",
// 			payload: JSON.stringify({
// 				message: message,
// 				from: session?.user?._id, // Sender's user ID
// 				to: recipientID, // Recipient's user ID
// 			}),
// 		};
// 		console.log("this is the event for sedning  : ",event)

// 		// Send the event to the WebSocket server
// 		socket.send(JSON.stringify(event));

// 		// Clear the input
// 		setMessage("");
// 	};

// 	console.log("this ishte messages okie : ",messages)

// 	return (
// 		<div className="p-4">
// 			<h1 className="text-2xl font-bold mb-4">Chat Application</h1>

// 			{/* Recipient ID Input */}
// 			{_isConnected} :: {_transport}
// 			<div className="mb-4">
// 				<label htmlFor="recipient" className="block text-sm font-medium mb-1">
// 					Recipient ID:
// 				</label>
// 				<input
// 					type="text"
// 					id="recipient"
// 					placeholder="Enter recipient ID"
// 					value={recipientID}
// 					onChange={(e) => setRecipientID(e.target.value)}
// 					className="border p-2 rounded w-full"
// 				/>
// 			</div>

// 			{/* Chat Messages Display */}
// 			<div className="mb-4 h-64 overflow-y-auto border p-4 rounded">
// 				{messages.map((msg, index) => (
// 					<div key={index} className="mb-2">
// 						<p className="text-sm text-white">
// 							{msg.from} ({new Date(msg.sent).toLocaleTimeString()}):
// 						</p>
// 						<p className="text-lg">{msg.message}</p>
// 					</div>
// 				))}
// 			</div>

// 			{/* Message Input */}
// 			<div className="flex gap-2">
// 				<input
// 					type="text"
// 					onKeyUp={(e) => {
// 						if (e.key === "Enter") {
// 							sendMessage();
// 						}
// 					}}
// 					placeholder="Type a message..."
// 					value={message}
// 					onChange={(e) => setMessage(e.target.value)}
// 					className="border p-2 rounded flex-grow"
// 				/>
// 				<button
// 					onClick={sendMessage}
// 					className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
// 				>
// 					Send
// 				</button>
// 			</div>
// 		</div>
// 	);
// }


import React from 'react'

function page() {
  return (
	<div>
	  <Conversations />
	</div>
  )
}

export default page
