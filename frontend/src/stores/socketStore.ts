import type { socketState } from "@/types/socketType";
import { io } from "socket.io-client";
import { create } from "zustand";
import { useUserStore } from "./userStore";
import { useMessageStore } from "./messageStore";
import { useConversationStore } from "./conversationStore";
/**
 * DONE
 */
export const useSocketStore = create<socketState>((set, get) => ({
  socket: null,

  connected: async (accessToken: string) => {
    let socket = get().socket;
    if (socket) return;

    socket = io(import.meta.env.VITE_BACKEND_BASE_URL, {
      auth: { token: accessToken }, //dữ liệu trong socket.handshake
      reconnection: true, //bậc chế độ tự kết nối
      reconnectionAttempts: 5, //cho phép kết nối 5 lần
      reconnectionDelay: 1000, //thời gian mỗi lần kêt nối chậm 1000ms
      transports: ["websocket"], //Chỉ sử dụng websocket thuần, tắt fallback
    });

    socket.on("connect", () => {
      console.log("Đã kết nối Socket");
    });

    socket.on("connect_error", (err) => {
      console.error("Lỗi kết nối Socket", err.message);
    });

    socket.on("reconnect_failedr", () => {
      console.error("Kết nối lại Socket quá nhiều");
    });

    socket.on("disconnect", () => {
      console.log("Đã ngắt kết nối Socket");
    });

    socket.on("user-online", ({ userIds, user }) => {
      // Nhận user mới
      useUserStore.getState().addUser(user);
      // Nhận danh sách userId online
      useUserStore.getState().setOnlineUserIds(userIds);
    });

    socket.on("new-message", ({ message, conversationId }) => {
      // lấy tin nhắn cuối
      useConversationStore
        .getState()
        .updateLastMessage(conversationId, message);

      // cập nhật tin nhắn khi gửi trong conversation
      useMessageStore
        .getState()
        .updateMessagesByConversationId(conversationId, message);
    });

    set({ socket });
  },
  disconnected: async () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
