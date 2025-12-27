import { useUserService } from "@/services/userService";
import type { userState } from "@/types/userType";
import { create } from "zustand";

export const useUserStore = create<userState>((set, get) => ({
  users: [],
  onlineUserIds: [],

  setUsers: (users) => set(() => ({ users })),
  setOnlineUserIds: (onlineUserIds) => set(() => ({ onlineUserIds })),
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
  addUser: (user) => {
    const { users, setUsers } = get();
    if (user) {
      const exists = users.some(
        (u) => u._id.toString() === user._id.toString()
      );
      if (!exists) {
        setUsers([...users, user]);
      }
    }
  },
}));
