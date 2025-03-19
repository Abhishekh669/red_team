import { ObjectId } from "mongodb";


export interface MessageEditModel {
    _id : ObjectId,
    senderId : ObjectId,
    text : string,
    conversationId : ObjectId,
}

export interface MessageEditModelFromClient {
    _id : string,
    senderId : string,
    text : string,
    conversationId : string,
    otherMembers : string[]
}

export interface MessageModel {
    _id : ObjectId,
    senderId : ObjectId,
    receiverId ?: ObjectId,
    text ?: string,
    image ?: string,
    conversationId : ObjectId,
    createdAt : Date,
    updatedAt ?: Date,
    seenBy ?: ObjectId[],
    reactions ?: Reaction[],
    replyTo  ?: ReplyToType
}

interface ReplyToType{
    _id : string,
    text : string,
    sender : {
        _id : string,
        name : string,
        image : string
    }

}


interface Reaction {
    emoji : string,
    users : string[]
}


export interface MessageModelRequest {
    senderId : string,
    receiverId ?: string,
    text ?: string,
    image ?: string,
    conversationId : string,
}