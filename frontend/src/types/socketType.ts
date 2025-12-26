import { Socket } from "socket.io-client";

export interface socketState {
  socket: Socket | null;
  connected: (token: string) => void;
  disconnected: () => void;
}
