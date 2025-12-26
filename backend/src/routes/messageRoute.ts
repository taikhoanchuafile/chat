import express from "express";

import { createMessageController } from "../controllers/messageController";

const router = express.Router();

router.post("/", createMessageController);

export default router;
