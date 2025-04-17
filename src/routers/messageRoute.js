import express from "express";
import {
  createMessage,
  deleteMessage,
  getAllMessages,
} from "../controllers/messageController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const messageRouter = express.Router();

messageRouter.post("/send", createMessage);
messageRouter.get("/all", getAllMessages);
messageRouter.delete("/delete/:id", isAuthenticated, deleteMessage);

export default messageRouter;
