import { useConversationService } from "@/services/conversationService";
import type { conversationState } from "@/types/conversationType";
import { create } from "zustand";
import { useMessageStore } from "./messageStore";
import { useSocketStore } from "./socketStore";

export const useConversationStore = create<conversationState>((set, get) => ({
  conversations: [],
  conversation: null,

  setConversations: (conversations) => set({ conversations }),
  setConversation: (conversation) => set({ conversation }),

  getConversations: async () => {
    try {
      const { conversations } = await useConversationService.getConversations();
      get().setConversations(conversations);
    } catch (error) {
      console.error("Lỗi khi gọi getOtherUsers", error);
    }
  },
  createConversation: async (recipientId) => {
    try {
      const { conversation, messages } =
        await useConversationService.createConversation(recipientId);

      // Lưu conversation để hiện tên trên khung chat bên phải
      get().setConversation(conversation);
      const conversationId = conversation._id;

      // Lưu danh sách tin nhắn tương ứng conversation để hiển thị bên trong
      useMessageStore
        .getState()
        .setMessagesByConversationId(conversationId, messages);

      // Join socketid vào phòng conversationId
      useSocketStore
        .getState()
        .socket?.emit("join-conversation", { conversationId });
    } catch (error) {
      console.error("Lỗi khi gọi getOtherUsers", error);
    }
  },
  updateLastMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((con) =>
        con._id === conversationId ? { ...con, lastMessage: message } : con
      ),
    })),
}));
