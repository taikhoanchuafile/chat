import { api } from "@/api/axios";

export const useUserService = {
  getOtherUsers: async () => {
    const res = await api.get("/users");
    console.log(res.data);

    return res.data; //users || []
  },
};
