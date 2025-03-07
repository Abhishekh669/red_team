import { MongoClient } from "mongodb";

let db: MongoClient;
export const initDatabase = async() =>{
    const mongoURl = process.env.MONGO_URL!;
    if(!mongoURl){
        throw new Error("Mongo URl not found")
    }
    const client = new MongoClient(mongoURl);
    try {
        await client.connect();
        console.log("Database connected successfully")
        db = client;
    } catch (error) {
        throw new Error("Mongo URl not found")
    }
}


export const getCollection = async (colName : string) =>{
    const dbName = process.env.DB_NAME;

    if(!db){
        throw new Error("Data client is not initiated")
    }

    if (!colName) {
        throw new Error("Collection name is not mentioned");
    }

    if (!dbName) {
        throw new Error("DB name is not initialized");
    }
    return db.db(dbName).collection(colName)
}


