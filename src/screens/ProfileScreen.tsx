import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Modal, Switch, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  // Estados para controlar as janelas (Modals) e configurações
  const [showSettings, setShowSettings] = useState(false);
  const [showPets, setShowPets] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [myPets, setMyPets] = useState<any[]>([]); // Futuramente buscaremos do banco

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

  const handleExportData = () => {
    Alert.alert("LGPD - Exportação", "Um arquivo contendo seus dados será enviado para o seu e-mail de cadastro em até 24 horas.");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir sua conta e todos os dados dos seus pets permanentemente?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => Alert.alert("Conta excluída!") }
      ]
    );
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
      {/* Cabeçalho do Perfil */}
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

      {/* Menu Principal */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => setShowPets(true)}>
          <Icon name="paw" size={24} color={colors.primary} />
          <Text style={styles.menuText}>Meus Pets</Text>
          <Icon name="chevron-forward" size={20} color="#ccc" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => setShowSettings(true)}>
          <Icon name="settings-outline" size={24} color={colors.text} />
          <Text style={styles.menuText}>Configurações</Text>
          <Icon name="chevron-forward" size={20} color="#ccc" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logoutBtn]} onPress={handleSignOut}>
          <Icon name="log-out-outline" size={24} color="#ff4444" />
          <Text style={[styles.menuText, { color: '#ff4444' }]}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL: MEUS PETS */}
      <Modal visible={showPets} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Meus Pets</Text>
            <TouchableOpacity onPress={() => setShowPets(false)}>
              <Icon name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {myPets.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="paw-outline" size={60} color="#ddd" />
                <Text style={styles.emptyText}>Você ainda não cadastrou nenhum pet.</Text>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>+ Adicionar Pet</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Aqui entrará a lista de pets quando conectarmos a tabela de pets!
              <Text>Lista de pets...</Text>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* MODAL: CONFIGURAÇÕES */}
      <Modal visible={showSettings} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Configurações</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Icon name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            
            <TouchableOpacity style={styles.settingsOption}>
              <View style={styles.settingsOptionLeft}>
                <Icon name="create-outline" size={24} color={colors.text} />
                <Text style={styles.settingsText}>Editar Perfil</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <View style={styles.settingsOption}>
              <View style={styles.settingsOptionLeft}>
                <Icon name="notifications-outline" size={24} color={colors.text} />
                <Text style={styles.settingsText}>Notificações</Text>
              </View>
              <Switch 
                value={notificationsEnabled} 
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#767577", true: colors.primary }}
              />
            </View>

            <Text style={styles.sectionTitle}>Privacidade (LGPD)</Text>
            <TouchableOpacity style={styles.settingsOption} onPress={handleExportData}>
              <View style={styles.settingsOptionLeft}>
                <Icon name="download-outline" size={24} color={colors.text} />
                <Text style={styles.settingsText}>Exportar meus dados</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsOption} onPress={handleDeleteAccount}>
              <View style={styles.settingsOptionLeft}>
                <Icon name="trash-outline" size={24} color="#ff4444" />
                <Text style={[styles.settingsText, { color: '#ff4444' }]}>Excluir Conta</Text>
              </View>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </Modal>

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
  logoutBtn: { marginTop: 20, borderColor: '#ff444433', borderWidth: 1 },
  
  // Estilos dos Modals
  modalContainer: { flex: 1, backgroundColor: colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  modalContent: { padding: 20 },
  
  // Estilos da aba de Configurações
  settingsOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  settingsOptionLeft: { flexDirection: 'row', alignItems: 'center' },
  settingsText: { fontSize: 16, marginLeft: 15, color: colors.text },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#999', marginTop: 30, marginBottom: 10, textTransform: 'uppercase' },
  
  // Estilos da aba de Pets
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 15, marginBottom: 30, paddingHorizontal: 40 },
  primaryButton: { backgroundColor: colors.primary, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});