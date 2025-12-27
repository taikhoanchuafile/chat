import { NextFunction, Request, Response } from "express";
import { io } from "../sockets/indexSocket";
import { findConversationByConversationId } from "../services/conversationService";
import { createMessage } from "../services/messageService";
import { Types } from "mongoose";

export const createMessageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // lấy user từ middleware
    const senderId = req.user?._id;
    const { conversationId, content } = req.body;
    if (!senderId || !conversationId || !content) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    // Kiểm tra cuộc trò chuyện có cả 2 user này tham gia hay không
    const conversation = await findConversationByConversationId(conversationId);
    if (!conversation) {
      return res.status(404).json({
        message: "Không tìm thấy cuộc hội thoại",
      });
    }

    //Kiểm tra cuộc trò chuyện có người nhận tin nhắn hay không
    const receiver = conversation.participants.find(
      (id) => id.toString() !== senderId.toString()
    );
    if (!receiver) {
      return res.status(401).json({ message: "Tin nhắn không hợp lệ" });
    }

    // Kiểm tra người nhận có phải người gửi hay không
    if (receiver.toString() === senderId.toString()) {
      return res
        .status(401)
        .json({ message: "Không được gửi tin nhắn cho chính mình" });
    }

    const receiverIdIO = new Types.ObjectId(receiver);
    const conversationIdIO = new Types.ObjectId(conversationId);
    const message = await createMessage(
      senderId,
      receiverIdIO,
      conversationIdIO,
      content
    );

    // cập nhật lại tin nhắn cuối trong conversation
    conversation.lastMessage = message._id;
    await conversation.save();

    const populated = await message.populate({
      path: "senderId content",
      select: "name avatar",
    });

    io.to(conversationId).emit("new-message", {
      message: populated,
      conversationId,
    });

    return res.status(201).json({ conId: conversationId, message: populated });
  } catch (error) {
    console.error("Lỗi khi gọi createMessageController", error);
    next(error);
  }
};
