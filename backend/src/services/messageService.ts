import { Types } from "mongoose";
import Message from "../models/messageModel";

// Hiển thị toàn bộ tin nhắn theo cuộc trò chuyện
export const findMessageByConversationId = async (conversationId: string) => {
  return await Message.find({ conversationId });
};

// Khi nhập tin nhắn và gửi, hàm ghi db
export const createMessage = async (
  senderId: Types.ObjectId,
  receiver: Types.ObjectId,
  conversationId: Types.ObjectId,
  content: string
) => {
  const message = await Message.create({
    senderId,
    receiver,
    conversationId,
    content,
  });
  return message;
};
