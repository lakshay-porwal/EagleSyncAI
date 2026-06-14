import api from "../utils/api";
import { ChatMessage } from "../types";

export const chatService = {
  getHistory: async (): Promise<ChatMessage[]> => {
    try {
      const res = await api.get("/users/chat-history");
      const messages = res.data.messages || [];
      return messages.map((m: any) => ({
        id: m.id,
        sender: m.sender,
        content: m.content,
        timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
    } catch (err) {
      console.error("Failed to load chat history:", err);
      return [];
    }
  },

  saveHistory: async (history: ChatMessage[]): Promise<void> => {
    // History is auto-saved in the backend on sendMessage, but we sync if needed
    try {
      const payload = history.map(m => ({
        id: m.id,
        sender: m.sender,
        content: m.content,
        timestamp: new Date(), // Convert to Date object
      }));
      await api.post("/users/chat-history", { messages: payload });
    } catch (err) {
      console.error("Failed to save chat history:", err);
    }
  },

  sendMessage: async (messageText: string): Promise<ChatMessage> => {
    try {
      const res = await api.post("/agents/chat", { message: messageText });
      const { reply, timestamp, id } = res.data;
      
      const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return {
        id,
        sender: "ai",
        content: reply,
        timestamp: time,
      };
    } catch (err: any) {
      console.error("Failed to send chat message:", err);
      const msg = err.response?.data?.error || "Sorry, I encountered an error. Please try again.";
      return {
        id: "msg-err-" + Date.now(),
        sender: "ai",
        content: msg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }
  },
};
