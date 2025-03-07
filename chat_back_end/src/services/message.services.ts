import { ObjectId } from "mongodb";
import { getCollection } from "../lib/db/db";
import { MessageModel } from "../models/messages.model";
import { MessageTypeFromServer } from "../lib";

const populateMessageDetails = async (message: MessageModel) => {
  const senderData = await getUserById(message.senderId);
  if (!senderData || !senderData._id || !senderData.email) {
    return null;
  }

  const receiverData = await getUserById(message.receiverId);
  if (!receiverData || !receiverData._id || !receiverData.email) {
    return null;
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
    receiver: {
      _id: receiverData._id,
      name: receiverData.name,
      email: receiverData.email,
      address: receiverData.address,
      field: receiverData.field,
      image: receiverData.image,
      codeName: receiverData.codeName,
    },
    seenBy : SeenByUsers,
    createdAt : message.createdAt
  };
  return populatedMessage
};

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
