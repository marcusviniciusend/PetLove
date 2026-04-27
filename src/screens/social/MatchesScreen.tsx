import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';
import { useMatches } from '../../hooks/useMatches';

export default function MatchesScreen({ navigation }: any) {
  const { matches, loading } = useMatches();

  const handleOpenChat = (match: any) => {
    // Navegação correta para uma tela aninhada dentro de um Tab.Screen
    navigation.navigate('Matches', { // Nome da Tab.Screen que contém o MatchesStack
      screen: 'Chat', // Nome da Stack.Screen dentro do MatchesStack
      params: { // Parâmetros para a tela de Chat
        matchId: match.match_id, // Usamos o ID do match definitivo
        otherUserId: match.tutor_id, // Usamos o ID do tutor do outro pet
        otherUserName: match.name,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  

  const renderMatch = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.matchCard} 
      onPress={() => handleOpenChat(item)}
    >
      <Image
        source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=150' }}
        style={styles.avatar}
      />

      <View style={styles.matchInfo}>
        <Text style={styles.matchName}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.species} • {item.breed || 'Raça não definida'}</Text>
      </View>
      <View style={styles.unreadBadge} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Matches</Text>
        <Text style={styles.subtitle}>Pets que você demonstrou interesse!</Text>
      </View>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={renderMatch}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum match ainda. Volte ao Swipe e dê um like!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: { padding: 20, paddingTop: 50, backgroundColor: colors.primary },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#fff', opacity: 0.8 },
  listContainer: { padding: 15 },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  matchInfo: { flex: 1 },
  matchName: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  lastMessage: { fontSize: 14, color: colors.inactive },
  unreadBadge: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  emptyContainer: { marginTop: 100, alignItems: 'center' },
  emptyText: { fontSize: 16, color: colors.inactive }
});