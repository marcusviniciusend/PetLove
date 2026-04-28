import { create } from 'zustand';
import { Message } from '../types';

interface ChatState {
  messagesByMatch: Record<string, Message[]>;
  setMessages: (matchId: string, messages: Message[]) => void;
  appendMessage: (matchId: string, message: Message) => void;
  clearMatch: (matchId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messagesByMatch: {},

  setMessages: (matchId, messages) =>
    set((s) => ({
      messagesByMatch: { ...s.messagesByMatch, [matchId]: messages },
    })),

  appendMessage: (matchId, message) =>
    set((s) => {
      const existing = s.messagesByMatch[matchId] ?? [];
      if (existing.some((m) => m.id === message.id)) return s;
      return {
        messagesByMatch: {
          ...s.messagesByMatch,
          [matchId]: [...existing, message],
        },
      };
    }),

  clearMatch: (matchId) =>
    set((s) => {
      const next = { ...s.messagesByMatch };
      delete next[matchId];
      return { messagesByMatch: next };
    }),
}));
