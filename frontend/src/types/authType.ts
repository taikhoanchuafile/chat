import type { User } from "./userType";

export interface ISignIn {
  email: string;
  password: string;
}

export interface ISignUp {
  name: string;
  email: string;
  password: string;
}

export interface authState {
  isLoading: boolean;
  accessToken: string | null;
  user: User | null;

  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;

  signUp: (payload: ISignUp) => Promise<void>;
  signIn: (payload: ISignIn) => Promise<void>;
  signOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  signInGG: (credential: string) => Promise<void>;
}
