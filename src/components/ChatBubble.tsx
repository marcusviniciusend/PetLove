import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../types';
import { colors } from '../theme/colors';

type Props = {
  message: Message;
  isMyMessage: boolean;
};

export function ChatBubble({ message, isMyMessage }: Props) {
  const timeString = message.created_at
    ? new Date(message.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <View style={[styles.bubble, isMyMessage ? styles.myBubble : styles.theirBubble]}>
      <Text style={[styles.text, isMyMessage && styles.myText]}>{message.content}</Text>
      {timeString && (
        <Text style={[styles.time, isMyMessage && styles.myTime]}>{timeString}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  myBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
  text: { fontSize: 16, color: colors.text },
  myText: { color: '#fff' },
  time: {
    fontSize: 11,
    color: colors.inactive,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  myTime: { color: 'rgba(255, 255, 255, 0.7)' },
});
