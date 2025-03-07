import { getCollection } from "../lib/db/db";
import { Chat } from "../models/conversation.model";



export const createNewConversation = async(data : Omit<Chat, "_id">) =>{
    try {
        const conversationCollection = await getCollection("chats")
        if(!conversationCollection){
            return null;
        }

        const newConversation = await conversationCollection.insertOne(data);
        if(!newConversation.insertedId){
            return null;
        }
        return {
            _id : newConversation.insertedId,
            ...data
        }
        
    } catch (error) {
        return null;
        
    }

}
