import { Document, Types } from "mongoose";

export interface IMessage extends Document {
  senderId: Types.ObjectId;
  receiver: Types.ObjectId;
  conversationId: Types.ObjectId;
  content: string;
  type?: "text" | "image" | "video" | "file";
  isSeen?: boolean;
  seenBy?: Types.ObjectId[];
}
