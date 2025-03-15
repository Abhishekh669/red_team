import { Request, Response } from "express";
import { MessageModel } from "../models/messages.model";
import { createNewMessage, getUserById } from "../services/message.services";
import { ObjectId } from "mongodb";
import { getReceiverSocketId, io } from "../lib/socket";
import { getConversationById } from "../services/chat.services";

export const createNewMessageHandler = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (!data.senderId  || !data.conversationId) {
      res.status(400).json({ error: "Missing required fields" });
    }

    const senderData = await getUserById(new ObjectId(data.senderId));
    if (!senderData || !senderData._id || !senderData.email) {
      res.status(400).json({ error: "user does not exists" });
    }
    if(data.receiverId){
      const receiverData = await getUserById(new ObjectId(data.receiverId));
    if (!receiverData || !receiverData._id || !receiverData.email) {
      res.status(400).json({ error: "user does not exists" });
    }
    }

    console.log("I am fine till here")

    const messageData: Omit<MessageModel, "_id"> = {
      senderId: new ObjectId(data.senderId),
      conversationId: new ObjectId(data.conversationId),
      createdAt: new Date(),
      seenBy: [new ObjectId(data.senderId)],
      ...(data.receiverId && {receiverId : data.receiverId}),
      ...(data.text && { text: data.text }),
      ...(data.image && { image: data.image }),
    };

    console.log("this is messageData : ",messageData)
    const newMessage = await createNewMessage(messageData);
    console.log("this is the new message in the express : ", newMessage);

    if (!newMessage) {
      res.status(400).json({ error: "failed to create message" });
    }

    if (newMessage) {
      if (newMessage.conversationId) {
        const conversation = await getConversationById(
          newMessage.conversationId
        );
        if (!conversation) {
          res.status(400).json({ error: "conversation does not exists" });
        }
        console.log(
          "this is the conversation members : ",
          conversation?.members
        );
        if (conversation?.isGroup) {
          const receiverMembers = conversation?.members.filter(
            (m: ObjectId) => !m.equals(newMessage.sender._id)
          );

          if (receiverMembers.length === 0) {
            res.status(400).json({ error: "members does not exists" });
          }

          receiverMembers.forEach((id: ObjectId) => {
            const receiverSocketId = getReceiverSocketId(id.toString());
            if (receiverSocketId) {
              console.log("this is received socket id : ", receiverSocketId);
              io.to(receiverSocketId).emit("newMessage", newMessage);
              console.log("i think i am done");
            } else {
              console.log("Receiver is not connected.");
            }
          });
        } else {
          try {
            if(newMessage.receiver?._id){
              const receiverSocketId = getReceiverSocketId(
                newMessage.receiver._id.toString()
              );
              if (receiverSocketId) {
                console.log("this is received socket id : ", receiverSocketId);
                io.to(receiverSocketId).emit("newMessage", newMessage);
                console.log("i think i am done");
              } else {
                console.log("Receiver is not connected.");
              }
            }
          } catch (error) {
            console.error("Error sending message:", error);
          }
        }
      } else {
        res.status(400).json({ error: "conversation id  not exists" });
      }
    }
    res
      .status(200)
      .json({ message: "successfully created message", newMessage });
  } catch (error) {
    res.status(400).json({ error: "failed to create new message" });
  }
};
