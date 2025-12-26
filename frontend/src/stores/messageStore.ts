import type { MessageState } from "@/types/messageType";
import { userMessageService } from "../services/messageService";
import { create } from "zustand";

export const useMessageStore = create<MessageState>((set) => ({
  messagesByConversationId: {},

  setMessagesByConversationId: (conversationId, messages) =>
    set((state) => ({
      messagesByConversationId: {
        ...state.messagesByConversationId,
        [conversationId]: messages,
      },
    })),

  createMessage: async (conversationId, content) => {
    try {
      await userMessageService.createMessage(conversationId, content);
    } catch (error) {
      console.error("Lỗi khi gọi createMessage", error);
    }
  },

  updateMessagesByConversationId: (conversationId, message) =>
    set((state) => ({
      messagesByConversationId: {
        ...state.messagesByConversationId,
        [conversationId]: [
          ...(state.messagesByConversationId[conversationId] || []),
          message,
        ],
      },
    })),
}));
