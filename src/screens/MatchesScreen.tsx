import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

// Dados falsos para testarmos a interface
const MOCK_MATCHES = [
  {
    id: '1',
    name: 'Luna',
    lastMessage: 'Oi! Meu pet adorou o seu perfil!',
    photoUrl: 'https://images.unsplash.com/photo-1605568420105-beb2e5c8e3cc?auto=format&fit=crop&w=150&q=80',
    unread: true, // Tem mensagem nova
  },
  {
    id: '2',
    name: 'Thor',
    lastMessage: 'Vamos marcar um passeio no parque?',
    photoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=150&q=80',
    unread: false, // Já foi lida
  },
];

export default function MatchesScreen() {
  const [matches] = useState(MOCK_MATCHES);

  // A função que desenha cada item da lista
  const renderMatch = ({ item }: { item: typeof MOCK_MATCHES[0] }) => (
    <TouchableOpacity 
      style={styles.matchCard} 
      onPress={() => console.log('Abrir chat com:', item.name)}
    >
      <Image source={{ uri: item.photoUrl }} style={styles.avatar} />
      
      <View style={styles.matchInfo}>
        <Text style={styles.matchName}>{item.name}</Text>
        <Text 
          style={[styles.lastMessage, item.unread && styles.unreadMessage]} 
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>

      {/* Bolinha vermelha/rosa se houver mensagem não lida */}
      {item.unread && <View style={styles.unreadBadge} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Matches</Text>
        <Text style={styles.subtitle}>Inicie uma conversa com seus novos amigos!</Text>
      </View>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={renderMatch}
        contentContainerStyle={styles.listContainer}
        // O que mostrar se a lista estiver vazia:
        ListEmptyComponent={
          <Text style={styles.emptyText}>Você ainda não tem matches. Continue no Swipe!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  header: { 
    padding: 20, 
    paddingTop: 50, 
    backgroundColor: colors.primary 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#fff', 
    opacity: 0.8 
  },
  listContainer: { 
    padding: 15 
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    // Sombras para dar destaque
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatar: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    marginRight: 15 
  },
  matchInfo: { 
    flex: 1 
  },
  matchName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: colors.text, 
    marginBottom: 4 
  },
  lastMessage: { 
    fontSize: 14, 
    color: colors.inactive 
  },
  unreadMessage: { 
    fontWeight: 'bold', 
    color: colors.text 
  },
  unreadBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginLeft: 10,
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 50, 
    fontSize: 16, 
    color: colors.inactive 
  },
});