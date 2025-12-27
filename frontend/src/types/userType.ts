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
  onlineUserIds: string[] | [];

  setUsers: (users: User[]) => void;
  setOnlineUserIds: (onlineUserIds: string[]) => void;
  getOtherUsers: () => Promise<void>;
  addUser: (user: User) => void;
}
