import { ObjectId } from "mongodb";

export interface MessageModel {
    _id : ObjectId,
    senderId : ObjectId,
    receiverId ?: ObjectId,
    text ?: string,
    image ?: string,
    conversationId : ObjectId,
    createdAt : Date,
    seenBy ?: ObjectId[]
}


export interface MessageModelRequest {
    senderId : string,
    receiverId ?: string,
    text ?: string,
    image ?: string,
    conversationId : string,
}