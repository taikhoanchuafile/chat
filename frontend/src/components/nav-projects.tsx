"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/stores/userStore";
import { useConversationStore } from "@/stores/conversationStore";
import type { User } from "@/types/userType";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

export function NavProjects() {
  const users = useUserStore((state) => state.users);
  const currentUser = useAuthStore((state) => state.user);

  const onlineUserIds = useUserStore((state) => state.onlineUserIds);
  const conversations = useConversationStore((state) => state.conversations);
  const createConversation = useConversationStore(
    (state) => state.createConversation
  );
  const handleClick = async (user: User) => {
    await createConversation(user._id);
  };

  return (
    <>
      {conversations.length > 0 && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden flex-1">
          <SidebarGroupLabel className="font-bold capitalize">
            Chat
          </SidebarGroupLabel>
          <SidebarMenu>
            {conversations.map((con) => (
              <SidebarMenuItem key={con._id} className="cursor-pointer">
                <SidebarMenuButton asChild>
                  <div>
                    {con.participants
                      .filter(
                        (p) => p._id.toString() !== currentUser?._id.toString()
                      )
                      .map((u) => {
                        return (
                          <div
                            key={u._id}
                            onClick={() => handleClick(u)}
                            className="flex gap-2"
                          >
                            <div className="relative">
                              <img
                                className="size-6 rounded-full"
                                src={u.avatar}
                                alt={u.name}
                              />
                              <Circle
                                className={cn(
                                  "w-3 h-3 drop-shadow-md absolute bottom-1 right-0",
                                  [...onlineUserIds].includes(u._id.toString())
                                    ? "text-green-500 fill-green-500"
                                    : "text-red-500 fill-red-500"
                                )}
                                strokeWidth={0}
                              />
                            </div>
                            <div className="text-xs">
                              <h2>{u.name}</h2>
                              <p className="text-neutral-500 opacity-80 line-clamp-1">
                                <span
                                  className={cn(
                                    [...onlineUserIds].includes(
                                      u._id.toString()
                                    )
                                      ? "font-bold uppercase"
                                      : ""
                                  )}
                                >
                                  {con.lastMessage.content}
                                </span>
                                {" . "}
                                {con.lastMessage.createdAt &&
                                  new Date(
                                    con.lastMessage.createdAt
                                  ).toLocaleDateString()}
                              </p>
                              <p className="text-neutral-500 opacity-80 line-clamp-1"></p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      )}
      {users.length > 0 && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden flex-1">
          <SidebarGroupLabel className="font-bold capitalize">
            Danh sách người tham gia
          </SidebarGroupLabel>
          <SidebarMenu>
            {users.map((user) => (
              <SidebarMenuItem key={user._id} className="cursor-pointer">
                <SidebarMenuButton asChild>
                  <div onClick={() => handleClick(user)} className="space-x-1">
                    <div className="relative">
                      <img
                        className="size-6 rounded-full"
                        src={user.avatar}
                        alt={user.name + "Image"}
                      />
                      <Circle
                        className={cn(
                          "w-3 h-3 drop-shadow-md absolute -bottom-1 -right-1",
                          [...onlineUserIds].includes(user._id.toString())
                            ? "text-green-500 fill-green-500"
                            : "text-red-500 fill-red-500"
                        )}
                        strokeWidth={0}
                      />
                    </div>
                    <div className="text-xs">
                      <h2>{user.name}</h2>
                      <p className="text-neutral-500 opacity-80">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      )}
    </>
  );
}
