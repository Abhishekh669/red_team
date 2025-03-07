import { ObjectId } from "mongodb";
import { getCollection } from "../lib/db/db";

export const getUserById = async(id : string, email : string)=>{
    try {
        const users = await getCollection("users");
        if(!users){
            return null;
        }
        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid user ID");
        }
        let query = {_id :  new ObjectId(id), email}
        const findUser = await users.findOne(query)
        return findUser || null;
    } catch (error) {
       return null;
        
    }
}