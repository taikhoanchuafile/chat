import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import authRoutes from "./routes/authRoute";
import userRoutes from "./routes/userRoute";
import coversationRoutes from "./routes/conversationRoute";
import messageRoutes from "./routes/messageRoute";
import { errorHandles } from "./middlewares/errorHandles";
import { protectedMiddleware } from "./middlewares/protectedMiddleware";
import cookieParser from "cookie-parser";
import http from "http";
import { initSocket } from "./sockets/indexSocket";

const app = express();
const { PORT, FRONTEND_URL } = env;

app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());

// public
app.use("/api/auth", authRoutes);

// private
app.use(protectedMiddleware);
app.use("/api/users", userRoutes);
app.use("/api/conversations", coversationRoutes);
app.use("/api/messages", messageRoutes);

// cấu hình socket init
const server = http.createServer(app);
initSocket(server);

// Hứng error
app.use(errorHandles);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("Server đang chạy trên cổng", PORT);
  });
});
