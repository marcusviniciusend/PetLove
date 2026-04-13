//card do pet que aparece na tela

import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

// Pegando a largura e altura da tela do celular dinamicamente
const { width, height } = Dimensions.get('window');

// Definindo os tipos para o TypeScript parar de reclamar
interface PetCardProps {
  pet: {
    id: number | string;
    name: string;
    breed: string;
    age: number;
    owner_name: string;
    image_url?: string; 
  };
}

export default function PetCard({ pet }: PetCardProps) {
  // Se o pet não tiver foto no banco, usamos essa de gatinho/cachorro genérica
  const imageUrl = pet.image_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop';

  return (
    <View style={styles.card}>
      {/* Imagem de Fundo */}
      <Image source={{ uri: imageUrl }} style={styles.image} />
      
      {/* Container com um fundo escuro transparente para o texto dar leitura em cima da foto */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{pet.name}, {pet.age}</Text>
        <Text style={styles.breed}>{pet.breed}</Text>
        <Text style={styles.owner}>Tutor(a): {pet.owner_name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.9, // 90% da largura da tela
    height: height * 0.65, // 65% da altura da tela
    borderRadius: 20,
    backgroundColor: '#fff',
    
    // Sombras (iOS e Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    
    overflow: 'hidden', // Impede que a foto quadrada saia pelas bordas arredondadas
    alignSelf: 'center',
    marginBottom: 20, // Espaço para não grudar no próximo card na rolagem
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute', // Faz a imagem ficar no fundo
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    paddingBottom: 30,
    backgroundColor: 'rgba(0,0,0,0.5)', // Degradê escuro para destacar o texto branco
  },
  name: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  breed: {
    color: '#E0E0E0',
    fontSize: 18,
    marginTop: 4,
  },
  owner: {
    color: '#FF6600', // O Laranja oficial do Pet Love
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
});