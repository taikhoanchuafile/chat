import { useAuthStore } from "@/stores/authStore";
import { useConversationStore } from "@/stores/conversationStore";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRouter = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const getOtherUsers = useUserStore((state) => state.getOtherUsers);
  const users = useUserStore((state) => state.users);
  const getConversations = useConversationStore(
    (state) => state.getConversations
  );
  const conversations = useConversationStore((state) => state.conversations);
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!user) {
        await fetchMe();
      }
      if (users.length < 1) {
        await getOtherUsers();
      }
      if (conversations.length < 1) {
        await getConversations();
      }
    };
    init();
    setStarting(false);
  }, []);

  if (starting || isLoading) {
    return <div className="flex items-center justify-center">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/signin" replace></Navigate>;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ProtectedRouter;
