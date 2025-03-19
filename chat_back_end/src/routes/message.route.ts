import { Router } from "express";
import { createNewMessageHandler, DeleteMessageHandler, EditMessageHandler } from "../controllers/message.controller";

const router = Router();

router.post("/create",createNewMessageHandler)
router.post("/update", EditMessageHandler)
router.delete("/delete/:id", DeleteMessageHandler)

export default router;