import express from "express";
import {
  createConversationController,
  getConversationsController,
} from "../controllers/conversationController";

const router = express.Router();

router.get("/me", getConversationsController);
router.post("/", createConversationController);

export default router;
