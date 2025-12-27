import { Types } from "mongoose";
import Conversation from "../models/conversationModel";
import Message from "../models/messageModel";

export const getConversationsHasMessage = async (userId: Types.ObjectId) => {
  const conversations = await Conversation.find({
    participants: userId,
    lastMessage: { $exists: true, $ne: null },
  })
    .populate({
      path: "participants",
      select: "name avatar isOnline",
    })
    .populate({
      path: "lastMessage",
      select: "receiver content createdAt",
      populate: {
        path: "receiver",
        select: "name avatar isOnline",
      },
    })
    .sort({ updatedAt: -1 })
    .lean(); //Xóa toàn bộ những hàm() đi kèm kết quả trả về, sau khi lean() thì sẽ không thể sử dụng hàm đi kèm như save(), populate(),...
  return conversations;
};

// Tạo cuộc hội thoại và tin nhắn đi kèm của cuộc hội thoại
export const createConversationAndMessages = async (
  userId: Types.ObjectId,
  recipientId: Types.ObjectId
) => {
  // lấy conversation theo người nhận, phải đúng có đủ 2 người tham gia
  let conversation = await Conversation.findOne({
    participants: { $all: [userId, recipientId] },
  });
  if (!conversation) {
    // Chưa có conversation thì tạo ra
    conversation = await Conversation.create({
      participants: [userId, recipientId],
    });
  }

  //lấy danh sách tin nhắn
  const messages = await Message.find({ conversationId: conversation._id })
    .populate({ path: "senderId", select: "name avatar" })
    .lean();

  const populated = await conversation.populate({
    path: "participants",
    select: "name avatar",
  });

  return { conversation: populated, messages };
};

// tìm conversation theo id
export const findConversationByConversationId = async (
  conversationId: string
) => {
  const conversation = await Conversation.findById(conversationId);
  return conversation;
};
