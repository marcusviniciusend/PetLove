import React, { useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import { moderateScale } from '../../utils/responsive'; // Importe o utilitário

// Suas importações estruturadas
import { useSwipe } from '../../hooks/useSwipe';
import PetCard from '../../components/PetCard';
import { matchService } from '../../services/matchService';
// Importando o nosso tema novo!
import { colors } from '../../theme/colors';

export default function SwipeScreen() {
  const { pets, loading, error } = useSwipe();
  const swiperRef = useRef<any>(null);

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
      <View style={styles.swiperContainer}>
      <Swiper
        ref={swiperRef}
        cards={pets}
        // Usando o seu componente isolado!
        renderCard={(card) => <PetCard pet={card} />}
        onSwipedLeft={(cardIndex) => {
          const pet = pets[cardIndex];
          if (pet) {
            matchService.registerInteraction(pet.id, 'dislike');
          }
        }}
        onSwipedRight={async (cardIndex) => {
          const pet = pets[cardIndex];
          if (pet) {
            const response = await matchService.registerInteraction(pet.id, 'like');

            if (response.match) {
              Alert.alert(
                '💖 IT\'S A MATCH!',
                `Você e ${pet.name} deram like um no outro! Em breve vocês poderão conversar.`
              );
            }
          }
        }}
        cardIndex={0}
        backgroundColor={colors.background}
        stackSize={3}
        verticalSwipe={false} // Tinder geralmente não usa swipe vertical
        cardVerticalMargin={moderateScale(20, 0.8)} // Margem vertical responsiva
        cardHorizontalMargin={moderateScale(10, 0.8)} // Margem horizontal responsiva
        containerStyle={{ backgroundColor: 'transparent' }}
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

      {/* Botões Flutuantes estilo Tinder */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, styles.dislikeButton]} 
          onPress={() => swiperRef.current?.swipeLeft()}
        >
          <Icon name="close" size={moderateScale(30)} color={colors.danger} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.likeButton]} 
          onPress={() => swiperRef.current?.swipeRight()}
        >
          <Icon name="heart" size={moderateScale(32)} color={colors.success} />
        </TouchableOpacity>
      </View>
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
  swiperContainer: {
    flex: 1,
    marginBottom: moderateScale(100), 
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
  footer: {
    position: 'absolute',
    bottom: moderateScale(20), // Botões mais próximos da borda inferior
    flexDirection: 'row',
    justifyContent: 'center', // Centraliza os botões
    width: '100%',
    alignItems: 'center',
    gap: moderateScale(50), // Espaço entre o X e o Coração
  },
  button: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  dislikeButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  likeButton: {
    borderWidth: 1,
    borderColor: 'rgba(76, 217, 100, 0.2)',
    width: moderateScale(74),
    height: moderateScale(74),
    borderRadius: moderateScale(37),
  },
});