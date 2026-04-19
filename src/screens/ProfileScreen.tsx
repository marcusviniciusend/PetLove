import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { colors } from '../theme/colors';
import LGPDConsent from '../components/LGPDConsent';
import { petService } from '../services/petService';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [hasConsent, setHasConsent] = useState(false);

  const handleSave = async () => {
    if (!hasConsent) {
      Alert.alert("Aviso", "Você precisa aceitar os termos da LGPD para continuar.");
      return;
    }

    if (!name || !breed || !age) {
      Alert.alert("Aviso", "Por favor, preencha o nome, a raça e a idade do pet.");
      return;
    }

    const success = await petService.saveProfile({
      name: name,
      breed: breed,
      age: parseInt(age, 10) || 0,
    });

    if (success) {
      Alert.alert("Sucesso!", "O perfil do seu pet foi salvo no banco de dados!");
      setName('');
      setBreed('');
      setAge('');
      setBio('');
      setHasConsent(false);
    } else {
      Alert.alert("Erro", "Não foi possível salvar. Verifique sua conexão e tente novamente.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil do Pet</Text>
        <Text style={styles.subtitle}>Mantenha os dados atualizados para melhores matches!</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome do Pet</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: Rex" 
          value={name} 
          onChangeText={setName} 
        />

        <Text style={styles.label}>Raça</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: Golden Retriever" 
          value={breed} 
          onChangeText={setBreed} 
        />

        <Text style={styles.label}>Idade</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: 2 anos" 
          keyboardType="numeric"
          value={age} 
          onChangeText={setAge} 
        />

        <Text style={styles.label}>Sobre o Pet</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Conte um pouco sobre a personalidade dele..." 
          multiline 
          numberOfLines={4}
          value={bio} 
          onChangeText={setBio} 
        />

        <LGPDConsent value={hasConsent} onValueChange={setHasConsent} />

        <TouchableOpacity 
          style={[styles.button, !hasConsent && styles.buttonDisabled]} 
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingTop: 50, backgroundColor: colors.primary },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#fff', opacity: 0.8 },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8, marginTop: 15 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 16, 
    backgroundColor: '#fff' 
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { 
    backgroundColor: colors.primary, 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 30,
    marginBottom: 50 
  },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});