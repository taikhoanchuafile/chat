import { Types } from "mongoose";
import { IUser } from "./userType";
import { Socket } from "socket.io";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: Partial<IUser>;
    }
  }
}
