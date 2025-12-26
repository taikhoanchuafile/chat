export interface User {
  _id: string;
  name: string;
  email: string;
  hashedPassword?: string;
  googleId?: string;
  isGoogleAccount?: boolean;
  avatar?: string;
  isOnline?: boolean;
}

export interface userState {
  users: User[] | [];
  onlineUsers: string[] | [];

  setUsers: (users: User[]) => void;
  setOnlineUsers: (onlineUsers: string[]) => void;

  getOtherUsers: () => Promise<void>;
}
