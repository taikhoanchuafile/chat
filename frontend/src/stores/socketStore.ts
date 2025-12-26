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
      auth: { token: accessToken },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Đã kết nối Socket");
    });

    socket.on("connect_error", (err) => {
      console.error("Lỗi kết nối Socket", err.message);
    });

    socket.on("disconnect", () => {
      console.log("Đã ngắt kết nối Socket");
    });

    socket.on("user-online", (users) => {
      useUserStore.getState().setOnlineUsers(users);
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
