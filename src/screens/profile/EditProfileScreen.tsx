import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/colors';
import _Icon from 'react-native-vector-icons/Ionicons';

const Icon = _Icon as React.ComponentType<{ name: string; size: number; color: string; style?: object }>;

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        let { data, error } = await supabase
          .from('profiles')
          .select(`full_name, bio`)
          .eq('id', user.id)
          .single();

        if (data) {
          setFullName(data.full_name || '');
          setBio(data.bio || '');
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      const updates = {
        id: user?.id,
        full_name: fullName,
        bio: bio,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Nome do Tutor</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Seu nome"
        />

        <Text style={styles.label}>Bio do Tutor</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          placeholder="Conte um pouco sobre você para outros tutores..."
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={updateProfile}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Salvar Alterações</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#eee', fontSize: 16, color: colors.text },
  bioInput: { height: 120, textAlignVertical: 'top' },
  saveButton: { backgroundColor: colors.primary, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 30 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});