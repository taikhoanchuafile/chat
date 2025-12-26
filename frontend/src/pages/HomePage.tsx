import { AppSidebar } from "@/components/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Send } from "lucide-react";
import { useConversationStore } from "@/stores/conversationStore";
import { useState, type FormEvent } from "react";
import { useMessageStore } from "@/stores/messageStore";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

const HomePage = () => {
  const [valueInput, setValueInput] = useState("");
  const user = useAuthStore((state) => state.user);
  const messagesByConversationId = useMessageStore(
    (state) => state.messagesByConversationId
  );
  const createMessage = useMessageStore((state) => state.createMessage);
  const conversation = useConversationStore((state) => state.conversation);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (conversation && valueInput.trim() !== "") {
      await createMessage(conversation._id, valueInput);
    }
    setValueInput("");
  };

  const other = conversation?.participants.find((p) => p._id !== user?._id);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {other && (
              <div className="flex gap-2 items-center">
                <img
                  className="size-8 rounded-full bg-neutral-400"
                  src={other?.avatar}
                  alt={other?.name}
                />
                <h2>{other?.name}</h2>
              </div>
            )}
          </div>
        </header>
        {conversation ? (
          <div className="overflow-auto flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="overflow-auto bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min space-y-2 p-2 flex flex-col justify-end">
              {messagesByConversationId[conversation._id].length > 0 &&
                messagesByConversationId[conversation._id].map((mess) => {
                  return (
                    <div
                      key={mess._id}
                      className={cn(
                        "flex flex-col",
                        mess.senderId._id === user?._id
                          ? "items-end"
                          : "items-start"
                      )}
                    >
                      <div className="flex gap-1 max-w-[80%] items-center">
                        <img
                          className={cn(
                            "size-8 rounded-full",
                            mess.senderId._id === user?._id ? "order-1" : ""
                          )}
                          src={mess.senderId.avatar}
                          alt={mess.senderId.name}
                        />
                        <p className="px-2 py-1 bg-primary w-fit text-neutral-100 rounded-2xl wrap-anywhere">
                          {mess.content}
                        </p>
                      </div>{" "}
                    </div>
                  );
                })}
            </div>
            <form action="" onSubmit={(e) => handleSubmit(e)}>
              <div className="flex gap-2">
                <Input
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  type="text"
                  placeholder="Nhặp vào ô để chat..."
                />
                <Button type="submit">
                  <Send />
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Loader size={100} />
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default HomePage;
