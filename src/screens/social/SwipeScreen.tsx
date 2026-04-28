import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useNavigation } from '@react-navigation/native';
import _Icon from 'react-native-vector-icons/Ionicons';

const Icon = _Icon as React.ComponentType<{ name: string; size: number; color: string; style?: object }>;

import { moderateScale } from '../../utils/responsive';
import { useSwipe } from '../../hooks/useSwipe';
import PetCard from '../../components/PetCard';
import { MatchModal } from '../../components/MatchModal';
import { matchService } from '../../services/matchService';
import { colors } from '../../theme/colors';
import { Pet } from '../../types';

export default function SwipeScreen() {
  const navigation = useNavigation<any>();
  const { pets, loading, error } = useSwipe();
  const swiperRef = useRef<any>(null);
  const [matchedPet, setMatchedPet] = useState<Pet | null>(null);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
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

  if (!pets || pets.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Fim da linha!</Text>
        <Text>Não há mais pets disponíveis no momento.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          cards={pets}
          renderCard={(card) => <PetCard pet={card} />}
          onSwipedLeft={(cardIndex) => {
            const pet = pets[cardIndex];
            if (pet) matchService.registerInteraction(pet.id, 'dislike');
          }}
          onSwipedRight={async (cardIndex) => {
            const pet = pets[cardIndex];
            if (!pet) return;
            const response = await matchService.registerInteraction(pet.id, 'like');
            if (response.match) setMatchedPet(pet);
          }}
          cardIndex={0}
          backgroundColor={colors.background}
          stackSize={3}
          verticalSwipe={false}
          cardVerticalMargin={moderateScale(20, 0.8)}
          cardHorizontalMargin={moderateScale(10, 0.8)}
          containerStyle={{ backgroundColor: 'transparent' }}
          animateCardOpacity
          overlayLabels={{
            left: {
              title: 'NÃO',
              style: {
                label: { backgroundColor: colors.danger, color: 'white', fontSize: 24 },
                wrapper: { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: 30, marginLeft: -30 },
              },
            },
            right: {
              title: 'MATCH!',
              style: {
                label: { backgroundColor: colors.success, color: 'white', fontSize: 24 },
                wrapper: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 30, marginLeft: 30 },
              },
            },
          }}
        />
      </View>

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

      <MatchModal
        visible={!!matchedPet}
        matchedPet={matchedPet}
        onViewMatches={() => {
          setMatchedPet(null);
          navigation.navigate('Matches');
        }}
        onContinue={() => setMatchedPet(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  swiperContainer: { flex: 1, marginBottom: moderateScale(100) },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 10 },
  errorText: { fontSize: 16, color: colors.danger },
  footer: {
    position: 'absolute',
    bottom: moderateScale(20),
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    gap: moderateScale(50),
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
  dislikeButton: { borderWidth: 1, borderColor: 'rgba(255, 59, 48, 0.2)' },
  likeButton: {
    borderWidth: 1,
    borderColor: 'rgba(76, 217, 100, 0.2)',
    width: moderateScale(74),
    height: moderateScale(74),
    borderRadius: moderateScale(37),
  },
});
