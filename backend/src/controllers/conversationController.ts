import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import User from "../models/userModel";
import {
  createConversationAndMessages,
  getConversationsHasMessage,
} from "../services/conversationService";

/**
 * Load toàn bộ conversation bên trái
 * @param req req.user từ middleware
 * @param res
 * @param next
 * @returns
 */
export const getConversationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Người dùng chưa đăng nhập hoặc hết phiên" });
    }

    // Lấy danh sách conversations có tin nhắn
    const conversations = await getConversationsHasMessage(userId);

    return res.status(200).json({ conversations });
  } catch (error) {
    console.error("Lỗi khi gọi getConversationsController", error);
    next(error);
  }
};

/**
 * Ấn vào conversation hoặc ấn vào người người khác
 * @param req body:{ recipientId, content }
 * @param res
 * @param next
 * @returns
 */
export const createConversationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // lấy user từ middleware
    const userId = req.user?._id;
    const { recipientId } = req.body;
    if (!userId || !recipientId) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    // validate id người nhận xem có phải là objectid hợp lệ không
    if (!Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ message: "ID người nhận không hợp lệ" });
    }
    const recipientIdOI = new Types.ObjectId(recipientId);

    //kiểm tra xem id người nhận có nằm trong user db hay không
    const isExists = await User.exists({ _id: recipientIdOI });
    if (!isExists) {
      return res.status(404).json({ message: "Người nhận không hợp lệ" });
    }

    // tạo conversation và danh sách messages đi kèm
    const { conversation, messages } = await createConversationAndMessages(
      userId,
      recipientIdOI
    );

    return res.status(200).json({ conversation, messages: messages ?? [] });
  } catch (error) {
    console.error("Lỗi khi gọi getConversationByRecipentIdController", error);
    next(error);
  }
};
