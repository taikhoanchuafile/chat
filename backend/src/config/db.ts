import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URL!);
    console.log("Kết nối CSDL thành công");
  } catch (error) {
    console.error("Kết nối CSDL thất bại");
    process.exit(1);
  }
};
