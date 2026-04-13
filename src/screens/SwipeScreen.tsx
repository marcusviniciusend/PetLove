import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-deck-swiper'; // Importando a mágica!
import { useSwipe } from '../hooks/useSwipe';
import PetCard from '../components/PetCard';

export default function SwipeScreen() {
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

  // Tela de "Acabou os pets"
  if (pets.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Fim da linha!</Text>
        <Text>Não há mais pets disponíveis no momento.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Pet Love</Text>
      </View>

      {/* Container do Baralho */}
      <View style={styles.swiperContainer}>
        <Swiper
          cards={pets}
          // A propriedade principal: ensina a biblioteca a desenhar o NOSSO cartão
          renderCard={(pet) => {
            if (!pet) return <View />; // Proteção contra telas em branco
            return <PetCard pet={pet} />;
          }}
          // O que acontece quando arrasta para a ESQUERDA
          onSwipedLeft={(cardIndex) => {
            console.log('PASSEI ❌', pets[cardIndex].name);
          }}
          // O que acontece quando arrasta para a DIREITA
          onSwipedRight={(cardIndex) => {
            console.log('MATCH 💚', pets[cardIndex].name);
          }}
          // Quando o baralho acabar
          onSwipedAll={() => {
            console.log('Todos os pets foram vistos!');
          }}
          cardIndex={0} // Começa na primeira carta
          backgroundColor={'transparent'} // Fundo invisível para não estragar o nosso layout
          stackSize={3} // Mostra um "efeito cascata" de 3 cartas lá no fundo
          disableTopSwipe={true} // Bloqueia arrastar pra cima
          disableBottomSwipe={true} // Bloqueia arrastar pra baixo
          animateCardOpacity
          // Adesivos que aparecem enquanto você arrasta a carta
          overlayLabels={{
            left: {
              title: 'NÃO',
              style: {
                label: { backgroundColor: '#FF4444', color: 'white', fontSize: 32, borderRadius: 10, borderWidth: 2, borderColor: 'white' },
                wrapper: { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: 30, marginLeft: -30 }
              }
            },
            right: {
              title: 'MATCH',
              style: {
                label: { backgroundColor: '#4CAF50', color: 'white', fontSize: 32, borderRadius: 10, borderWidth: 2, borderColor: 'white' },
                wrapper: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 30, marginLeft: 30 }
              }
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  header: { paddingTop: 60, paddingBottom: 10, alignItems: 'center', zIndex: 2 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FF6600' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center' },
  swiperContainer: {
    flex: 1,
    // Essa margem negativa ajusta a altura interna da biblioteca para o cartão ficar centralizado
    marginTop: -40, 
  }
});