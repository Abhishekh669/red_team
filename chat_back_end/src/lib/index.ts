import { ObjectId } from "mongodb"

export interface UserInMessageType{
    address : string, 
    codeName : string,
    email : string,
     field : string ,
     image : string,
     name : string,
     _id : ObjectId
  }
  
  
  export interface MessageTypeFromServer{
    text : string,
    conversationId : string,
    seenBy : UserInMessageType[]
    sender : UserInMessageType
    receiver : UserInMessageType
    _id : ObjectId
  }
  