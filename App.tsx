import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native';
import { supabase } from './src/services/supabase'; // Nossa ponte!

export default function App() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar dados no banco
  async function fetchPets() {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*');

      if (error) throw error;
      if (data) setPets(data);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPets();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}><ActivityIndicator size="large" color="#FF6600" /></View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐾 Pet Love Matches</Text>
      
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
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
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FF6600' },
  card: { padding: 20, marginVertical: 8, backgroundColor: '#f9f9f9', borderRadius: 10, width: '90%', elevation: 3 },
  petName: { fontSize: 18, fontWeight: 'bold' },
  owner: { fontSize: 12, color: '#666', marginTop: 5 }
});