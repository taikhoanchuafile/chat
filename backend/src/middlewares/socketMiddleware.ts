import { ExtendedError, Socket } from "socket.io";
import { verifyAccessToken } from "../services/authService";
import { findUserByUserId } from "../services/userService";
/**
 * DONE
 * @param socket auth:{ token: accessToken }
 * @param next ExtendedError
 * @returns
 */
export const socketMiddleware = async (
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

    const user = await findUserByUserId(decoded.userId);
    if (!user) {
      return next(new Error("NotFound: Không tìm thấy user"));
    }

    socket.data.user = user;

    next();
  } catch (error) {
    console.error("Lỗi khi xác minh JWT socketIO", error);
    next(new Error("Unauthorized: token không hợp lệ"));
  }
};
