import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route"
import messageRouter from "./routes/message.route"
import { initDatabase } from "./lib/db/db";
import { middlewareValidation } from "./controllers/auth.controller";
import { app, server } from "./lib/socket";

dotenv.config({
  path : "./.env"
});

const port = process.env.PORT ; //8080

app.use(cors({
  origin : "http://localhost:3000",
  optionsSuccessStatus : 200,
  credentials : true,
}))

app.use(express.urlencoded({extended : true}))
app.use(cookieParser())
app.use(express.json()) //for json parsing 
app.use(helmet());
app.use(middlewareValidation);

app.use("/api/chat/auth",authRouter)
app.use("/api/chat/message", messageRouter)



server.listen(port, () => {
  initDatabase();
  console.log(`[server]: Server is  running at http://localhost:${port}`);
});