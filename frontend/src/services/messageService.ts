import { api } from "@/api/axios";

export const userMessageService = {
  createMessage: async (conversationId: string, content: string) => {
    const res = await api.post("/messages", { conversationId, content });
    console.log(res.data);

    return res.data; //conId, message
  },
};
