import { ObjectId } from "mongodb";

export interface Chat {
    _id : ObjectId,
    members : ObjectId[],
    isGroup ?: boolean,
    name ?: string,
    groupImage : string,
    messages ?: ObjectId[],
    createdAt : Date
    lastMessageAt ?: Date
}



export interface ChatRequest {
    members : string[],
    isGroup ?: boolean,
    name ?: string,
    groupImage ?: string,
}