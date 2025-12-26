import { useAuthService } from "@/services/authService";
import type { authState } from "@/types/authType";
import { toast } from "react-toastify";
import { create } from "zustand";

export const useAuthStore = create<authState>((set, get) => ({
  isLoading: false,
  accessToken: null,
  user: null,

  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),

  signUp: async (payload) => {
    try {
      set({ isLoading: true });
      await useAuthService.signUp(payload);
      toast.success("Đăng ký thành công");
    } catch (error) {
      console.error("Lỗi khi signUp", error);
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (payload) => {
    try {
      set({ isLoading: true });
      const token = await useAuthService.signIn(payload);
      get().setAccessToken(token);
      await get().fetchMe();
      toast.success("Đăng nhập thành công");
    } catch (error) {
      console.error("Lỗi khi signIn", error);
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      await useAuthService.signOut();
      set({ isLoading: false, accessToken: null, user: null });
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.error("Lỗi khi signOut", error);
      set({ accessToken: null, user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMe: async () => {
    try {
      set({ isLoading: true });
      const { user } = await useAuthService.fetchMe();
      get().setUser(user);
    } catch (error) {
      console.error("Lỗi khi fetchMe", error);
    } finally {
      set({ isLoading: false });
    }
  },

  signInGG: async (credential) => {
    try {
      set({ isLoading: true });
      const token = await useAuthService.signInGG(credential);

      get().setAccessToken(token);
      await get().fetchMe();
      toast.success("Đăng nhập thành công");
    } catch (error) {
      console.error("Lỗi khi signInGG", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
