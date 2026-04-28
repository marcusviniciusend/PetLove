import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../theme/colors';
import { Pet } from '../types';

type Props = {
  visible: boolean;
  matchedPet: Pet | null;
  onViewMatches: () => void;
  onContinue: () => void;
};

export function MatchModal({ visible, matchedPet, onViewMatches, onContinue }: Props) {
  if (!matchedPet) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>💖</Text>
          <Text style={styles.title}>IT'S A MATCH!</Text>
          <Text style={styles.subtitle}>
            Você e{' '}
            <Text style={styles.petName}>{matchedPet.name}</Text>{' '}
            deram like um no outro!
          </Text>

          {matchedPet.image_url ? (
            <Image
              source={{ uri: matchedPet.image_url }}
              style={styles.petImage}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={[styles.petImage, styles.petImagePlaceholder]} />
          )}

          <TouchableOpacity style={styles.primaryButton} onPress={onViewMatches}>
            <Text style={styles.primaryButtonText}>Ver Matches 💬</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onContinue}>
            <Text style={styles.secondaryButtonText}>Continuar explorando</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  emoji: { fontSize: 48, marginBottom: 8 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  petName: { fontWeight: 'bold', color: colors.primary },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 28,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  petImagePlaceholder: {
    backgroundColor: '#f0f0f0',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: {
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: colors.inactive,
    fontSize: 14,
  },
});
