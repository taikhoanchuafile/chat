import type { User } from "./userType";

export interface Message {
  _id: string;
  senderId: User;
  receiver: User;
  conversationId: string;
  content: string;
  type?: "text" | "image" | "video" | "file";
  isSeen?: boolean;
  seenBy?: string[];
  createdAt?: string;
}

export interface MessageState {
  messagesByConversationId: Record<string, Message[]>;

  createMessage: (conversationId: string, content: string) => Promise<void>;

  setMessagesByConversationId: (
    conversationId: string,
    message: Message[]
  ) => void;
  updateMessagesByConversationId: (
    conversationId: string,
    message: Message
  ) => void;
}
