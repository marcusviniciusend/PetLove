import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

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
          .select(`full_name, bio, avatar_url`)
          .eq('id', user.id)
          .single();

        if (data) setProfile(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imagePlaceholder}>
          <Icon name="person" size={80} color="#ccc" />
          <TouchableOpacity style={styles.editImageBtn}>
            <Icon name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.name}>{profile?.full_name || 'Tutor Sem Nome'}</Text>
        <Text style={styles.bio}>{profile?.bio || 'Adicione uma bio para que outros tutores o conheçam!'}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="paw" size={24} color={colors.primary} />
          <Text style={styles.menuText}>Meus Pets</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="settings-outline" size={24} color={colors.text} />
          <Text style={styles.menuText}>Configurações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logoutBtn]} onPress={handleSignOut}>
          <Icon name="log-out-outline" size={24} color="#ff4444" />
          <Text style={[styles.menuText, { color: '#ff4444' }]}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#fff', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  imagePlaceholder: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  editImageBtn: { position: 'absolute', bottom: 5, right: 5, backgroundColor: colors.primary, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  name: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  bio: { fontSize: 14, color: colors.text, opacity: 0.6, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 },
  menu: { marginTop: 30, paddingHorizontal: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderRadius: 12, marginBottom: 10 },
  menuText: { marginLeft: 15, fontSize: 16, fontWeight: '500', color: colors.text },
  logoutBtn: { marginTop: 20, borderProgress: 1, borderColor: '#ff444433', borderWidth: 1 }
});