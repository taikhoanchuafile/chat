import { api } from "@/api/axios";

export const useConversationService = {
  getConversations: async () => {
    const res = await api.get("/conversations/me");
    return res.data; //conversations || []
  },

  createConversation: async (recipientId: string) => {
    const res = await api.post("/conversations", { recipientId });
    return res.data; //conversation, meassages
  },
};
