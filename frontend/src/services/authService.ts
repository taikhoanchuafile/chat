import { api } from "@/api/axios";
import type { ISignIn, ISignUp } from "@/types/authType";

export const useAuthService = {
  signIn: async (payload: ISignIn) => {
    const res = await api.post("/auth/signin", payload);
    return res.data; //accessToken
  },
  signUp: async (payload: ISignUp) => {
    const res = await api.post("/auth/signup", payload);
    return res.data;
  },
  signOut: async () => {
    const res = await api.post("/auth/signout");
    return res.data;
  },
  fetchMe: async () => {
    const res = await api.get("/users/me");
    return res.data; //{user}
  },
  signInGG: async (credential: string) => {
    const res = await api.post("/auth/signingg", { credential });
    return res.data; //accessToken
  },
};
