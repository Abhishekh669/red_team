import  { Router } from "express"
import { validateSession } from "../controllers/auth.controller";


const router = Router();

router.get("/validateToken", validateSession)

export default router;


