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
      get().setConversation(conversation);
      const conversationId = conversation._id;

      useMessageStore
        .getState()
        .setMessagesByConversationId(conversationId, messages);

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
