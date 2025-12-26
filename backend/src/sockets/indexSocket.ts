import { Server } from "socket.io";
import { env } from "../config/env";
import http from "http";
import { socketMiddleware } from "../middlewares/socketMiddleware";
import Conversation from "../models/conversationModel";

/**
 *
 * @param server DONE
 */

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
  });

  // đặt middleware io
  io.use(socketMiddleware);

  // Khởi tạo danh sách chứa user online
  const onlineUsers = new Map<string, Set<string>>();

  // nghe cổng kết nối
  io.on("connect", async (socket) => {
    console.log("Đã kết nối socket server", socket.id);
    const userId = socket.data.userId;

    console.log(userId);
    if (!userId) {
      console.error("Không có user trong socket data");
      return socket.disconnect();
    }

    // user không nằm trong danh sách online thì tạo mới
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    //user đăng nhặp nhiều máy sẽ có socketId tương ứng, cho hết vào danh sách value( Set() )
    onlineUsers.get(userId)?.add(socket.id);

    // Tạm bỏ qua cập nhật isOnline user db

    // Phát tin hiệu cho FE
    io.emit("user-online", Array.from(onlineUsers.keys())); //key[]

    // Nhận tin hiệu click tạo conversation, join socketId vào room
    socket.on("join-conversation", async ({ conversationId }) => {
      if (!conversationId) {
        return;
      }
      const isExists = await Conversation.exists({
        _id: conversationId,
        participants: userId,
      });
      if (!isExists) {
        return;
      }
      socket.join(conversationId);
    });
    /**
     * disconnect
     */
    socket.on("disconnect", async () => {
      console.log("socket server đã ngắt kết nối", socket.id);

      // Lấy value(Set()) ra
      const listSet = onlineUsers.get(userId);
      if (!listSet) {
        return;
      }

      // khi người dùng logut 1 phiên bản ra thì xóa 1 socketId tương ứng
      listSet.delete(socket.id);

      // Kiểm tra danh sách Set()=> rổng thì offline hoàn toàn => xóa luôn key của Map()
      if (listSet.size === 0) {
        onlineUsers.delete(userId);
      }

      // Nếu có xử lý isOnline user db thì cập nhật lại tại trước khi phát tín hiệu

      //Phát lại tín hiệu để gửi lại danh sách user online còn lại cho FE
      io.emit("user-online", Array.from(onlineUsers.keys()));
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io chưa khởi tạo");
  return io;
};
