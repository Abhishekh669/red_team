import { Router } from "express";
import { createNewMessageHandler } from "../controllers/message.controller";

const router = Router();

router.post("/create",createNewMessageHandler)

export default router;