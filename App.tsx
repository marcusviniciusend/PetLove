import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Importando as nossas telas
import LoginScreen from './src/screens/LoginScreen';
import SwipeScreen from './src/screens/SwipeScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { colors } from './src/theme/colors';

// Importando a conexão com o banco
import { supabase } from './src/lib/supabase';

const Tab = createBottomTabNavigator();

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Checa se o usuário já tem uma sessão salva ao abrir o app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Fica escutando qualquer mudança de login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Tela de carregamento enquanto verifica o banco
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // A Regra do Guarda-Costas: Sem sessão válida? Mostra apenas o Login
  if (!session) {
    return <LoginScreen />;
  }

  // Com sessão válida: libera as abas do aplicativo
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Swipe"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.inactive,
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = '';

            if (route.name === 'Perfil') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Swipe') {
              iconName = focused ? 'paw' : 'paw-outline'; 
            } else if (route.name === 'Matches') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Perfil" component={ProfileScreen} />
        <Tab.Screen name="Swipe" component={SwipeScreen} />
        <Tab.Screen name="Matches" component={MatchesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}