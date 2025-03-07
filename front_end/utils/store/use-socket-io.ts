import {create} from "zustand"
import {io, Socket} from "socket.io-client"
import { useSessionStore } from "./use-session-store"
import { MessageTypeFromServer } from "@/types";




interface SocketState{
    socketMessage : MessageTypeFromServer  | null,
    setSocketMessage : () => void,
    selectedChat : string | null,
    setSelectedChat : (id : string) => void,
    socket : Socket | null,
    onlineUsers : string[],
    connectSocket : () => void,
    disconnectSocket : () => void,
    subscribeToMessages: () => void,
    unsubscribeToMessages : () => void,
}

const url = process.env.CHAT_BACKEND_URL! || "http://localhost:8080" ;


export const useSocketIOStore = create<SocketState>((set, get)=>{
    return {
        socketMessage : null,
        setSocketMessage : () =>{
            set({socketMessage : null})
        },
        selectedChat : null,
        setSelectedChat : (id : string) =>{
            set({selectedChat : id})
        },
        socket : null,
        onlineUsers : [],
        connectSocket : () =>{
            const user  = useSessionStore.getState().user;
            if(!user || get().socket?.connected) return;
            const socket = io(url,{
                query : {
                    userId : user._id,
                }
            })
            socket.connect();
            set({socket : socket})

            socket.on("getOnlineUsers",(userIds)=>{
                set({onlineUsers : userIds})
            })

        },
        disconnectSocket : ()=>{
                if(get().socket?.connected){
                    get().socket?.disconnect()
                }
        },
        subscribeToMessages : () =>{
            console.log("i am called subscribe okie ")
            const {selectedChat} = get();
            if(!selectedChat)return;
            const socket = get().socket;
            if(!socket)return;
            socket.on('newMessage',(newMessage)=>{
                if(newMessage.conversationId !== selectedChat)return;
                set({socketMessage : newMessage})
            })
        },
        unsubscribeToMessages : () =>{
            const socket = get().socket;
            if(!socket)return;
            socket.off("newMessage");
        }
        
    }


})