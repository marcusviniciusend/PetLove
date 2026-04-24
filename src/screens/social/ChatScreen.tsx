import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
}

export default function ChatScreen({ route, navigation }: any) {
  const { matchId, otherUserId, otherUserName } = route.params;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser(isMounted);
    loadMessages(isMounted);
    const unsubscribe = subscribeToMessages(isMounted);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [matchId]);

  const getCurrentUser = async (isMounted: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && isMounted) setCurrentUserId(user.id);
  };

  const loadMessages = async (isMounted: boolean) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (isMounted) {
        setMessages(data || []);
        await markAllAsRead();
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  const subscribeToMessages = (isMounted: boolean) => {
    // Usamos um nome de canal único com Math.random para evitar o erro 
    // "cannot add callbacks after subscribe" durante re-renderizações rápidas.
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
          const newMsg = payload.new as Message;
          if (isMounted) {
            setMessages((prev) => {
              // Proteção contra mensagens duplicadas que podem vir 
              // tanto do fetch inicial quanto do realtime
              if (prev.find(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
            setTimeout(() => scrollToBottom(), 100);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('messages')
        .update({ read: true })
        .eq('match_id', matchId)
        .eq('receiver_id', user.id)
        .eq('read', false);
    } catch (error) {
      console.error('Erro ao marcar como lidas:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId || !otherUserId || sending) {
      if (!otherUserId) console.error("Erro: otherUserId não definido nos parâmetros da rota");
      return;
    }

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      const { error } = await supabase.from('messages').insert({
        match_id: matchId,
        sender_id: currentUserId,
        receiver_id: otherUserId,
        content: messageText,
      });

      if (error) throw error;
      scrollToBottom();
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.sender_id === currentUserId;

    return (
      <View
        style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text style={[styles.messageText, isMyMessage && styles.myMessageText]}>
          {item.content}
        </Text>
        <Text style={[styles.messageTime, isMyMessage && styles.myMessageTime]}>
          {new Date(item.created_at).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{otherUserName || 'Chat'}</Text>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="chatbubbles-outline" size={64} color={colors.inactive} />
              <Text style={styles.emptyText}>
                Nenhuma mensagem ainda.{'\n'}Diga olá! 👋
              </Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mensagem..."
            placeholderTextColor={colors.inactive}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!newMessage.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icon name="send" size={20} color={newMessage.trim() ? '#fff' : colors.inactive} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
  },
  myMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 11,
    color: colors.inactive,
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.inactive,
    textAlign: 'center',
  },
});