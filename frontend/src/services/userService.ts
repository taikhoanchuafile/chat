import { api } from "@/api/axios";

export const useUserService = {
  getOtherUsers: async () => {
    const res = await api.get("/users");
    return res.data; //users || []
  },
};
