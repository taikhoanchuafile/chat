import { Types } from "mongoose";

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  lastMessage: Types.ObjectId;
  lastMessageAt?: Date;
  isGroup?: boolean;
}
