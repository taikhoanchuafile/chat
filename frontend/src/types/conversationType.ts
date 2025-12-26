import type { Message } from "./messageType";
import type { User } from "./userType";

export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage: Message;
}

export interface conversationState {
  conversations: Conversation[] | [];
  conversation: Conversation | null;

  setConversations: (conversations: Conversation[]) => void;
  setConversation: (conversation: Conversation) => void;

  getConversations: () => Promise<void>;
  createConversation: (recipientId: string) => Promise<void>;
  updateLastMessage: (conversationId: string, message: Message) => void;
}
