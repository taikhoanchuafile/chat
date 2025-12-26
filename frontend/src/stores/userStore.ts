import { useUserService } from "@/services/userService";
import type { userState } from "@/types/userType";
import { create } from "zustand";

export const useUserStore = create<userState>((set, get) => ({
  users: [],
  onlineUsers: [],

  setUsers: (users) => set({ users }),
  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
  getOtherUsers: async () => {
    try {
      const { users } = await useUserService.getOtherUsers();
      if (users.length > 0) {
        get().setUsers(users);
      }
    } catch (error) {
      console.error("Lỗi khi gọi getOtherUsers", error);
    }
  },
}));
