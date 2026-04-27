import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  match_id: string;
  created_at: string;
  read: boolean;
}

export const chatService = {
  async getMessages(matchId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async sendMessage(
    matchId: string,
    senderId: string,
    receiverId: string,
    content: string
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from('messages').insert({
      match_id: matchId,
      sender_id: senderId,
      receiver_id: receiverId,
      content,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  async markAllAsRead(matchId: string, userId: string): Promise<void> {
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('match_id', matchId)
      .eq('receiver_id', userId)
      .eq('read', false);
  },

  subscribeToMessages(
    matchId: string,
    onNewMessage: (msg: Message) => void
  ): () => void {
    const channelName = `chat:${matchId}:${Math.random().toString(36).slice(2, 11)}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          onNewMessage(payload.new as Message);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
