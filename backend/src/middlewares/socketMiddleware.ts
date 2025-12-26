import { ExtendedError, Socket } from "socket.io";
import { verifyAccessToken } from "../services/authService";
/**
 * DONE
 * @param socket auth:{ token: accessToken }
 * @param next ExtendedError
 * @returns
 */
export const socketMiddleware = (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token || typeof token !== "string") {
      return next(
        new Error("Unauthorized: Không có token hoặc token sai định dạng")
      );
    }
    const decoded = verifyAccessToken(token); //{userId}
    if (!decoded || !decoded.userId) {
      return next(new Error("Unauthorized: payload token không hợp lệ"));
    }

    socket.data.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Lỗi khi xác minh JWT socketIO", error);
    next(new Error("Unauthorized: token không hợp lệ"));
  }
};
