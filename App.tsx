import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importando as nossas telas
import SwipeScreen from './src/screens/SwipeScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Swipe"
        screenOptions={{
          tabBarActiveTintColor: '#FF6600', // Laranja do Pet Love
          tabBarInactiveTintColor: 'gray',
          headerShown: false, // Esconde a barra superior padrão
        }}
      >
        <Tab.Screen name="Perfil" component={ProfileScreen} />
        <Tab.Screen name="Swipe" component={SwipeScreen} />
        <Tab.Screen name="Matches" component={MatchesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}