import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router";
import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import { useSocketStore } from "./stores/socketStore";

const AppRouter = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const connected = useSocketStore((state) => state.connected);
  const disconnected = useSocketStore((state) => state.disconnected);

  useEffect(() => {
    if (accessToken) {
      connected(accessToken);
    }

    return () => disconnected();
  });

  return (
    <div>
      <ToastContainer />
      <Outlet></Outlet>
    </div>
  );
};

export default AppRouter;
