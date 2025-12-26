import { JwtPayload } from "jsonwebtoken";
import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  hashedPassword: string;
  googleId: string;
  isGoogleAccount: boolean;
  avatar?: string;
  verifyEmail?: boolean;
  isOnline?: boolean;
  comparePassword: (password: string) => Promise<boolean>;
}

export interface ISignUp {
  name: string;
  email: string;
  password: string;
}

export interface ISignIn {
  email: string;
  password: string;
}

export interface AccessTokenPayload extends JwtPayload {
  userId: string;
}
