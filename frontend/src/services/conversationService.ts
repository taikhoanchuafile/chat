import { api } from "@/api/axios";

export const useConversationService = {
  getConversations: async () => {
    const res = await api.get("/conversations/me");
    console.log(res.data);

    return res.data; //conversations || []
  },
  createConversation: async (recipientId: string) => {
    const res = await api.post("/conversations", { recipientId });
    console.log(res.data);

    return res.data; //conversation, meassages
  },
};
