import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { chatService } from '../services/chatService';
import { useChatStore } from '../stores/chatStore';

export function useChat(matchId: string, otherUserId: string) {
  const { messagesByMatch, setMessages, appendMessage } = useChatStore();
  const messages = messagesByMatch[matchId] ?? [];
  const isCached = !!messagesByMatch[matchId];

  const [loading, setLoading] = useState(!isCached);
  const [currentUserId, setCurrentUserId] = useState('');
  const currentUserIdRef = useRef('');

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isMounted) return;

      setCurrentUserId(user.id);
      currentUserIdRef.current = user.id;

      if (!isCached) {
        try {
          const data = await chatService.getMessages(matchId);
          if (isMounted) {
            setMessages(matchId, data);
            await chatService.markAllAsRead(matchId, user.id);
          }
        } catch (err) {
          console.error('Erro ao carregar mensagens:', err);
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        chatService.markAllAsRead(matchId, user.id);
        if (isMounted) setLoading(false);
      }
    };

    init();

    const unsubscribe = chatService.subscribeToMessages(matchId, (newMsg) => {
      if (!isMounted) return;
      appendMessage(matchId, newMsg);
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
