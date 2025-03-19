import { Request, Response } from "express";
import { MessageEditModel, MessageModel } from "../models/messages.model";
import { createNewMessage, deleteMessageById, EditMessage, getMessageById, getUserById } from "../services/message.services";
import { ObjectId } from "mongodb";
import { getReceiverSocketId, io } from "../lib/socket";
import { getConversationById } from "../services/chat.services";

export const DeleteMessageHandler = async(req : Request, res : Response) =>{
  try {
    const messageId = req.params.id;
    if(!messageId){
      res.status(400).json({error : "invalid message id "})
    }

    console.log("this is messageid ; ",messageId)

    const currentMessage = await getMessageById(new ObjectId(messageId))
    if(!currentMessage) res.status(400).json({error : "no such message exists"})
    const conversationDetails = await getConversationById(new ObjectId(currentMessage?.conversationId))
    if(!conversationDetails) res.status(400).json({error : "no conversation exists"})

    const deleteMessageResult = await deleteMessageById(new ObjectId(messageId));
    console.log("this is my delete message : ",deleteMessageResult)

    if(!deleteMessageResult) res.status(400).json({error : "failed to delete message id"})
      console.log("i am fine hoi ", conversationDetails, currentMessage)
    
    const otherMembers = conversationDetails?.members.filter((u : ObjectId)=> !u.equals(currentMessage?.sender._id))
    console.log("this is other memebers ",otherMembers)

    otherMembers.forEach((u : ObjectId)=>{
      const receiverId = getReceiverSocketId(u.toString())
      if(receiverId){
        io.to(receiverId).emit("deleteMessage",currentMessage)
      }else{
        console.log("Receiver is not online")
      }
    })
    res.status(200).json({message : "successfully deleted message", successStatus : true})
  } catch (error) {
    res.status(400).json({error : "failed to delete message"})
    
  }
}

export const EditMessageHandler = async(req : Request, res : Response) =>{
  try {
    const data = req.body;
    
    if(!data.otherMembers || !data._id || data.otherMembers.length === 0){
      res.status(400).json({error : "failed to get  message payload"})
    }
    
    const {_id, senderId, text, conversationId, otherMembers} = req.body;
    const checkUser = await getUserById(new ObjectId(senderId))
    if(!checkUser){
      res.status(400).json({error : "no user exists"})
    }
    const checkMesssage = await getMessageById(new ObjectId(_id))
    if(!checkMesssage){
      res.status(400).json({error : "failed to get message"})
    }

    const newEditMessageData : MessageEditModel = {
      _id : new ObjectId(_id),
      senderId : new ObjectId(senderId),
      text,
      conversationId : new ObjectId(conversationId),
    }


    const resutlAfterEdit = await EditMessage(newEditMessageData);
    if(!resutlAfterEdit){
      res.status(400).json({error : "failed to edit message"})
    }


    otherMembers.forEach((id : string)=>{
      const receiverSocketId = getReceiverSocketId(id);
      if(receiverSocketId){
        io.to(receiverSocketId).emit("updateMessage", resutlAfterEdit);
      } else{
        console.log("Receiver is not connected")
      }
    })
    
    res.status(200).json({message  :"successflly updated the message", successStatus : true})
  } catch (error) {
    res.status(400).json({error : "failed to edit message"})
  }
}

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


    const messageData: Omit<MessageModel, "_id"> = {
      senderId: new ObjectId(data.senderId),
      conversationId: new ObjectId(data.conversationId),
      createdAt: new Date(),
      seenBy: [new ObjectId(data.senderId)],
      ...(data.receiverId && {receiverId : new ObjectId(data.receiverId)}),
      ...(data.text && { text: data.text }),
      ...(data.image && { image: data.image }),
      ...(data.replyTo && {replyTo : data.replyTo})
    };

    const newMessage = await createNewMessage(messageData);

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
