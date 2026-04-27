import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { chatService } from '../services/chatService';
import { Message } from '../types';

export function useChat(matchId: string, otherUserId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');
  const currentUserIdRef = useRef('');

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isMounted) return;

      setCurrentUserId(user.id);
      currentUserIdRef.current = user.id;

      try {
        const data = await chatService.getMessages(matchId);
        if (isMounted) {
          setMessages(data);
          await chatService.markAllAsRead(matchId, user.id);
        }
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();

    const unsubscribe = chatService.subscribeToMessages(matchId, (newMsg) => {
      if (!isMounted) return;
      setMessages((prev) => {
        if (prev.find((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [matchId]);

  const sendMessage = useCallback(async (content: string): Promise<boolean> => {
    const userId = currentUserIdRef.current;
    if (!content.trim() || !userId || !otherUserId) return false;
    const result = await chatService.sendMessage(matchId, userId, otherUserId, content);
    return result.success;
  }, [matchId, otherUserId]);

  return { messages, loading, currentUserId, sendMessage };
}
