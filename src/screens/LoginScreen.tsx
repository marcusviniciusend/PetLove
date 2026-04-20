import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // <-- Importação do pacote de ícones
import { colors } from '../theme/colors';
import { authService } from '../services/authService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <-- Estado para controlar o olhinho

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Aviso", "Preencha e-mail e senha para entrar.");
      return;
    }
    
    setLoading(true);
    const response = await authService.signIn(email, password);
    setLoading(false);

    if (response.success) {
      Alert.alert("Sucesso!", "Você está logado no Pet Tinder!");
    } else {
      Alert.alert("Erro no Login", response.error);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Aviso", "Preencha e-mail e senha para criar sua conta.");
      return;
    }

    setLoading(true);
    const response = await authService.signUp(email, password);
    setLoading(false);

    if (response.success) {
      Alert.alert(
        "Conta Criada!", 
        "Sua conta foi registrada no banco de dados. Agora você pode fazer o login."
      );
    } else {
      Alert.alert("Erro no Cadastro", response.error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Pet Tinder</Text>
        <Text style={styles.subtitle}>Encontre o par perfeito para o seu pet</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword} // <-- A mágica da ocultação acontece aqui
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={24} 
              color="#999" 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Carregando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.registerText}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 42, fontWeight: 'bold', color: colors.primary },
  subtitle: { fontSize: 16, color: colors.text, opacity: 0.7, marginTop: 5 },
  form: { paddingHorizontal: 30 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8, marginTop: 15 },
  
  // Input padrão (usado no e-mail)
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 15, 
    fontSize: 16, 
    backgroundColor: '#fff' 
  },
  
  // Novos estilos para agrupar a senha e o ícone na mesma linha
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 15,
  },

  button: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  registerButton: { marginTop: 20, alignItems: 'center', padding: 10 },
  registerText: { color: colors.primary, fontSize: 14, fontWeight: '600' }
});