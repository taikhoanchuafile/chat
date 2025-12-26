import mongoose from "mongoose";
import { IMessage } from "../types/messageType";

const messageSchema = new mongoose.Schema<IMessage>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    content: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["text", "image", "video", "file"],
      default: "text",
    },
    isSeen: { type: Boolean, default: false },
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

// index để tìm kiếm theo conversationId
messageSchema.index({ conversationId: 1 });

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
