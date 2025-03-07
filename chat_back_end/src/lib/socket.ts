import { Server, Socket } from "socket.io";
import http from "http"
import express, {Express} from "express"

const app : Express = express();
const server = http.createServer(app)

const io = new Server(server, {
    cors : {
      origin : "http://localhost:3000",
      methods  : ["GET","POST"],
      credentials : true
    }
});

export function getReceiverSocketId(userId : string){
    return userSocketMap[userId]
}

//store online  users 
type UserId  = string
var userSocketMap  :  { [userId: UserId]: string } = {};




io.on("connection",(socket : Socket)=>{
    console.log("A user connected : ",socket.id)
    const userId = socket.handshake.query.userId as string;
    if(!userId)return;
    userSocketMap[userId] = socket.id
    console.log("users : ",userSocketMap)

    // io.emit() is used to send events to all the connected clients 
    io.emit("getOnlineUsers",Object.keys(userSocketMap))


    socket.on("disconnect",()=>{
        console.log("user disconnected : ",socket.id)
        delete userSocketMap[userId]
    })
})


export {app, server, io}