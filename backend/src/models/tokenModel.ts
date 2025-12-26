import mongoose from "mongoose";
import { IToken } from "../types/tokenType";

const tokenSchema = new mongoose.Schema<IToken>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: { type: String, required: true },
    expiredAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Tự động xóa khi hết hạn
tokenSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model<IToken>("Token", tokenSchema);
export default Token;
