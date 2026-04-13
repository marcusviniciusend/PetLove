import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useSwipe } from '../hooks/useSwipe'; // Importando nosso garçom!

export default function SwipeScreen() {
  // Olha como a tela fica limpa! Ela só consome o hook, não sabe nada de Supabase.
  const { pets, loading, error } = useSwipe();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6600" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Encontrar Pets</Text>
      
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.petName}>{item.name}</Text>
            <Text>{item.breed} • {item.age} anos</Text>
            <Text style={styles.owner}>Tutor: {item.owner_name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50, paddingHorizontal: 20 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FF6600', marginBottom: 20, textAlign: 'center' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center' },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3, 
  },
  petName: { fontSize: 18, fontWeight: 'bold' },
  owner: { fontSize: 12, color: 'gray', marginTop: 5 }
});