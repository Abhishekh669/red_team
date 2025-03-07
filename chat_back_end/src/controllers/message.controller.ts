import { Request, Response } from "express";
import { MessageModel, MessageModelRequest } from "../models/messages.model";
import { createNewMessage, getUserById } from "../services/message.services";
import { ObjectId } from "mongodb";
import { getReceiverSocketId, io } from "../lib/socket";
import { MessageTypeFromServer } from "../lib";
import { findPackageJSON } from "module";

export const createNewMessageHandler = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (!data.senderId || !data.receiverId || !data.conversationId) {
      res.status(400).json({ error: "Missing required fields" });
    }

    const senderData = await getUserById(new ObjectId(data.senderId))
    if(!senderData || !senderData._id || !senderData.email){
      res.status(400).json({error : "user does not exists"})
    }
    const receiverData = await getUserById(new ObjectId(data.receiverId))
    if(!receiverData || !receiverData._id || !receiverData.email){
      res.status(400).json({error : "user does not exists"})
    }

    const messageData : Omit<MessageModel, "_id"> = {
      senderId  : new ObjectId(data.senderId),
      receiverId : new ObjectId(data.receiverId),
      conversationId : new ObjectId(data.conversationId),
      createdAt :  new Date(),
      seenBy : [new ObjectId(data.senderId)],
      ...(data.text && {text : data.text}),
      ...(data.image && {image : data.image}),
    };

    const newMessage = await createNewMessage(messageData);
    
    
    if(!newMessage) {
      res.status(400).json({error : "failed to create message"})
    }
    if (newMessage) {
      try {
        const receiverSocketId = getReceiverSocketId(newMessage.receiver._id.toString());
        if (receiverSocketId) {
          console.log("this is received socket id : ", receiverSocketId);
          io.to(receiverSocketId).emit("newMessage", newMessage);
          console.log("i think i am done")
        } else {
          console.log("Receiver is not connected.");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
    res.status(200).json({message : "successfully created message", newMessage})
  } catch (error) {
    res.status(400).json({ error: "failed to create new message" });
  }
};


