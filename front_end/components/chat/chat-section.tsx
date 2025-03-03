// "use client";
// import { GetConversationAllMessages } from "@/actions/messages/message";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Loader } from "@/components/ui/Loader";
// import { useGetConversationAllMessages } from "@/utils/hooks/query-hooks/messages/use-get-all-messages";
// import { useGetSession } from "@/utils/hooks/query-hooks/sessions/use-get-sessions";
// import { useChatId } from "@/utils/use-chat-id";
// import React, { useState, useEffect, useMemo } from "react";
// import InfiniteScroll from "react-infinite-scroll-component";

// const MESSAGES_PER_PAGE = 10;

// const style = {
//   height: 30,
//   border: "1px solid green",
//   margin: 6,
//   padding: 8,
// };

// function ChatSection() {
//   const [items, setItems] = useState(Array.from({ length: 30 }));

//   // Function to fetch more data
//   const fetchMoreData = () => {
//     // Simulate an async API call with a timeout
//     setTimeout(() => {
//       setItems((prevItems) => prevItems.concat(Array.from({ length: 20 })));
//     }, 1500);
//   };

//   const [message, setMessage] = useState("");
//   // const [seenMessageId, setSeenMessageId] = useState<string | null>(null);
//   const [messages, setMessages] = useState<any[]>([]);
//   // const [totalCount, setTotalCount] = useState<number>(0);

//   const chatId = useChatId();
//   // const { data: chat } = useGetChatById(chatId);
//   const { data: session } = useGetSession();
//   // const { mutate: create_message } = useCreateMessage();

//   const { data: all_messages, isLoading: messages_loading } =
//     useGetConversationAllMessages({
//       conversationId: chatId,
//       limit: MESSAGES_PER_PAGE,
//       lastID: "",
//     });

//   console.log("this is the messages:", all_messages);

//   // **Memoized Last Message ID**
//   const lastMessageID = useMemo(() => {
//     return messages.length > 0 ? messages[messages.length - 1]._id : "";
//   }, [messages]);

//   // **Initialize Messages**
//   useEffect(() => {
//     if (!messages_loading && all_messages?.msgs) {
//       setMessages(all_messages.msgs.messages);
//       // setTotalCount(all_messages.msgs.totalCount); // Use totalCount from API
//     }
//   }, [messages_loading, all_messages?.msgs]);

//   // **Fetch Older Messages (Infinite Scroll)**
//   const fetchMoreDatas = async () => {
//     if (!lastMessageID) return;

//     try {
//       const res = await GetConversationAllMessages({
//         conversationId: chatId,
//         limit: MESSAGES_PER_PAGE,
//         lastID: lastMessageID,
//       });

//       if (res.message && res.msgs) {
//         const data = JSON.parse(res.msgs);
//         if (data.length > 0) {
//           setMessages((prevMessages) => [...prevMessages, ...data]);
//         } else {
//           // setTotalCount(messages.length); // No more messages
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch more messages:", error);
//     }
//   };

//   // **Send Message Handler**
//   const handle_send_message = () => {
//     if (message.length === 0) return;
//     const values = {
//       conversationId: chatId,
//       body: message,
//       sender: session?.user?._id as string,
//       image: "no image for now",
//     };

//     // create_message(values, {
//     //   onSuccess: (res) => {
//     //     if (res.message && res.msg) {
//     //       setMessage("");
//     //       setMessages((prevMessages) => [res.msg, ...prevMessages]); // Add sent message
//     //     } else {
//     //       toast.error(res.error);
//     //     }
//     //   },
//     //   onError: () => {
//     //     toast.error("Failed to send message");
//     //   },
//     // });
//   };

//   if (messages_loading) return <Loader />;

//   return (
//     <div className="p-2 bg-black max-h-[calc(100vh-130px)] h-[calc(100vh-110px)] lg:h-[calc(100vh-130px)] flex flex-col justify-between ">
//       {/* <InfiniteScroll
//           dataLength={messages?.length || 0}
//           next={fetchMoreData}
//           hasMore={messages.length < totalCount} // **Corrected Condition**
//           loader={<h4>Loading...</h4>}
//           className="overflow-y-scroll flex flex-col gap-y-4"
//         >
//           {messages.map((msg: any) => (
//             <div
//               key={msg._id}
//               className={cn(
//                 "flex justify-end",
//                 msg?.sender?._id !== session?.user?._id && "justify-start"
//               )}
//             >
//               <MessageBox
//                 message={msg}
//                 session={session}
//                 seenMessageId={seenMessageId}
//                 setSeenMessageId={setSeenMessageId}
//               />
//             </div>
//           ))}
//         </InfiniteScroll> */}

//       <InfiniteScroll
//         dataLength={items.length} // Current length of the data
//         next={fetchMoreData} // Function to load more data
//         hasMore={true} // Always true for infinite loading
//         loader={<h4>Loading...</h4>} // Loading spinner or message
//       >
//         {items.map((_, index) => (
//           <div style={style} className="text-white" key={index}>
//             div - #{index}
//           </div>
//         ))}
//       </InfiniteScroll>

//       <div>
//         <div className="flex gap-x-2">
//           <button className="bg-red-500" onClick={fetchMoreData}>
//             clikc me
//           </button>
//           <Input
//             className="text-white"
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 handle_send_message();
//               }
//             }}
//             placeholder="message here..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <Button onClick={handle_send_message}>Send</Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatSection;


import React from 'react'

function ChatSection() {
  return (
    <div>
      
    </div>
  )
}

export default ChatSection

