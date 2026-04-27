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
import { chatService, Message } from '../../services/chatService';
import { colors } from '../../theme/colors';
import _Icon from 'react-native-vector-icons/Ionicons';

const Icon = _Icon as React.ComponentType<{ name: string; size: number; color: string; style?: object }>;

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

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isMounted) return;

      setCurrentUserId(user.id);

      try {
        const data = await chatService.getMessages(matchId);
        if (isMounted) {
          setMessages(data);
          await chatService.markAllAsRead(matchId, user.id);
          setTimeout(() => scrollToBottom(), 100);
        }
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
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
      setTimeout(() => scrollToBottom(), 100);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [matchId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId || !otherUserId || sending) return;

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    const result = await chatService.sendMessage(matchId, currentUserId, otherUserId, messageText);

    if (!result.success) {
      console.error('Erro ao enviar:', result.error);
      setNewMessage(messageText);
    }

    setSending(false);
    scrollToBottom();
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
