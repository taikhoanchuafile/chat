import mongoose from "mongoose";
import { IConversation } from "../types/conversationType";

const conversationSchema = new mongoose.Schema<IConversation>(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    // lastMessageAt: { type: Date, default: Date.now() },
    // isGroup: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// index để search conversation theo user
conversationSchema.index({ participants: 1, updatedAt: -1 });

// // index để search conversation sắp xếp theo list chat
// conversationSchema.index({ lastMessageAt: 1 });

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);
export default Conversation;
