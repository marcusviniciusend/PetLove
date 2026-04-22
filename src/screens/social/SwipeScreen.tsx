import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-deck-swiper';

// Suas importações estruturadas
import { useSwipe } from '../../hooks/useSwipe';
import PetCard from '../../components/PetCard';
import { matchService } from '../../services/matchService';

// Importando o nosso tema novo!
import { colors } from '../../theme/colors';

export default function SwipeScreen() {
  const { pets, loading, error } = useSwipe();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        {/* Cor atualizada usando o tema central */}
        <ActivityIndicator size="large" color={colors.primary} />
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

  // Tela de "Acabou os pets"
  if (!pets || pets.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Fim da linha!</Text>
        <Text>Não há mais pets disponíveis no momento.</Text>
      </View>
    );
  }

  // O Baralho de Cards
  return (
    <View style={styles.container}>
      <Swiper
        cards={pets}
        // Usando o seu componente isolado!
        renderCard={(card) => <PetCard pet={card} />}
        onSwipedLeft={(cardIndex) => {
          const pet = pets[cardIndex];
          if (pet) {
            matchService.registerInteraction(pet.id, 'dislike');
          }
        }}
        onSwipedRight={(cardIndex) => {
          const pet = pets[cardIndex];
          if (pet) {
            matchService.registerInteraction(pet.id, 'like');
          }
        }}
        cardIndex={0}
        backgroundColor={colors.background}
        stackSize={3}
        animateCardOpacity
        overlayLabels={{
          left: {
            title: 'NÃO',
            style: { 
              label: { backgroundColor: colors.danger, color: 'white', fontSize: 24 }, 
              wrapper: { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: 30, marginLeft: -30 } 
            }
          },
          right: {
            title: 'MATCH!',
            style: { 
              label: { backgroundColor: colors.success, color: 'white', fontSize: 24 }, 
              wrapper: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 30, marginLeft: 30 } 
            }
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
  },
});