import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

// =============================================
//  REQUEST INTERCEPTOR: chặn và đính kèm token mỗi lần gửi request
// =============================================
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tạo 2 biến đánh dấu đang refresh và số lần thử lại
let isRefreshing = false;
let queue: any[] = [];

// =============================================
//  RESPONSE INTERCEPTOR: chặn response và xử lý
// =============================================
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    // Lưu lại cái request đầu tiên
    const originalRequest = err.config;

    if (
      (err.response?.status === 403 || err.response?.status === 401) &&
      !originalRequest._retry
    ) {
      // Nếu đang refresh → đẩy request vào queue
      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return resolve(api(originalRequest));
          });
        });
      }

      // bắt đầu refresh
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        // call api lấy accessToken mới
        const res = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // lưu accessToken mới vào store
        useAuthStore.getState().setAccessToken(res.data.accessToken);

        // resolve tất cả request đang chờ
        queue.forEach((cb) => cb(res.data.accessToken));
        queue = [];

        // Retry request hiện tại
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (error) {
        //đăng xuất và dọn sạch queue
        useAuthStore.getState().signOut();
        queue = [];
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    toast.error(err.response?.data?.message || "Lỗi rồi");
    return Promise.reject(err);
  }
);
