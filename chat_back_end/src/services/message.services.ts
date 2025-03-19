import { ObjectId, WithId } from "mongodb";
import { getCollection } from "../lib/db/db";
import { MessageEditModel, MessageModel } from "../models/messages.model";




const populateMessageDetails = async (message: MessageModel) => {
  const senderData = await getUserById(message.senderId);
  if (!senderData || !senderData._id || !senderData.email) {
    return null;
  }
  let receiverData;
 if(message.receiverId){
   receiverData = await getUserById(message.receiverId);
  if (!receiverData || !receiverData._id || !receiverData.email) {
    return null;
  }
 }

  var SeenByUsers = message.seenBy
  ? await Promise.all(
      message.seenBy.map(async (userId: ObjectId) => {
        const user = await getUserById(userId);
        return user
          ? {
              _id: user._id,
              name: user.name,
              email: user.email,
              address: user.address,
              field: user.field,
              image: user.image,
              codeName: user.codeName,
            }
          : null;
      })
    )
  : [];

  const populatedMessage = {
    _id: message._id,
    conversationId: message.conversationId,
    text: message.text,
    sender: {
      _id: senderData._id,
      name: senderData.name,
      email: senderData.email,
      address: senderData.address,
      field: senderData.field,
      image: senderData.image,
      codeName: senderData.codeName,
    },
    receiver: receiverData ? {
      _id: receiverData._id,
      name: receiverData.name,
      email: receiverData.email,
      address: receiverData.address,
      field: receiverData.field,
      image: receiverData.image,
      codeName: receiverData.codeName,
    } : null,
    seenBy : SeenByUsers,
    ...(message.replyTo && {replyTo : message.replyTo}),
    ...(message.reactions && {reactions : message.reactions}),
    createdAt : message.createdAt,
    updatedAt : message.updatedAt,
  };
  return populatedMessage
};



export const  deleteMessageById = async(id : ObjectId) =>{
  try {
    const messageCollection = await getCollection("messages");
    const deleteResult = await messageCollection.deleteOne({ _id: id });
    if (deleteResult.deletedCount === 0) return null;
    return true;
  } catch (error) {
    return null;
  }

}
  



export const getMessageById = async (id : ObjectId) =>{
  try {
    const messageCollection = await getCollection("messages")
    const findMessage = await messageCollection.findOne({_id : id})
    if(!findMessage)return null;
    return findMessage;
    
  } catch (error) {
    return null;
    
  }
}



export const EditMessage = async(message : MessageEditModel)=>{
  try {
    if(!message._id || !message.conversationId ){
      return null;
    }

    const messageCollection = await getCollection("messages")
    const result = await messageCollection.updateOne(
      {
        _id : message._id,
        conversationId : message.conversationId,
      },
      {
        $set : {
          text : message.text,
          updatedAt : new Date(),
        }
      }
    )

    if(result.matchedCount === 0){
      return null;
    }
    
    const doc = await getMessageById(message._id)
    if(!doc)return null;
    const messageModelMessage = {
      _id: doc._id,
      senderId: doc.senderId,
      receiverId: doc.receiverId,
      text: doc.text,
      image: doc.image,
      conversationId: doc.conversationId,
      createdAt: doc.createdAt,
      updatedAt : doc.updatedAt,
      seenBy: doc.seenBy,
      reactions: doc.reactions,
      replyTo: doc.replyTo,
    }
    const populatedMessage = await populateMessageDetails(messageModelMessage)
    return populatedMessage;
      
  } catch (error) {
    return null;
    
  }
  

}


export const createNewMessage = async (
  messageData: Omit<MessageModel, "_id">
) => {
  try {
    if (!messageData) return null;
    const messages = await getCollection("messages");
    const insertMessages = await messages.insertOne(messageData);
    if (!insertMessages.insertedId) {
      return null;
    }
    const populatedMessageDetails = await populateMessageDetails({_id : insertMessages.insertedId, ...messageData})
    if(!populatedMessageDetails)return null;
    return populatedMessageDetails;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (userId: ObjectId) => {
  const userCollection = await getCollection("users");
  return userCollection.findOne({ _id: userId });
};

export const getAllConversationMessages = async (
  conversationId: string,
  lastId: string,
  limit: number
) => {
  try {
    const messageCollection = await getCollection("messages");
    if (!messageCollection) {
      return null;
    }
    const filter: any = { conversationId: new ObjectId(conversationId) };

    const count = await messageCollection.countDocuments(filter);

    if (lastId) {
      filter._id = { $lt: new ObjectId(lastId) };
    }

    const messages = await messageCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 10)
      .toArray();

    if (!messages) {
      return null;
    }
  } catch (error) {
    return null;
  }
};
