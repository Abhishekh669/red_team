import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { getUserById } from "../services/auth.services";

export interface decodedDataType extends JwtPayload{
    sub : string,
    email : string,
    iat : number,
    exp : number,
  }



  export const middlewareValidation = async(req : Request, res : Response, next : NextFunction) =>{
    try {
        const {chat_session} = req.cookies;
        if(!chat_session){
            res.status(403).json({
                error : "failed to validate user"
            })
        }

        const user_data   =  jwt.verify(
            chat_session,
            process.env.SESSION_SECRET!
        ) as decodedDataType

        if(!user_data){
            res.status(400).json({error : "user not found"})
        }
        const findUser = await getUserById(user_data.sub, user_data.email);
        if(!findUser || !findUser._id || !findUser.email){
            res.status(400).json({error : "user not found"})
        }
        next();
    } catch (error) {
        res.status(400).json({error : "something went wrong"})
    }
} 
  




export const validateSession = async(req : Request, res : Response, next : NextFunction) =>{
    try {
        const {chat_session} = req.cookies;
        if(!chat_session){
            res.status(403).json({
                error : "failed to validate user"
            })
        }

        const user_data   =  jwt.verify(
            chat_session,
            process.env.SESSION_SECRET!
        ) as decodedDataType

        if(!user_data){
             res.status(400).json({error : "user not found"})
        }
        const findUser = await getUserById(user_data.sub, user_data.email);
        if(!findUser || !findUser._id || !findUser.email){
             res.status(400).json({error : "user not found"})
        }

        res.status(200).json({
            message  : "successfully authenticated",
            authenticated : true,
        })
    } catch (error) {
         res.status(400).json({error : "something went wrong"})
    }
}               