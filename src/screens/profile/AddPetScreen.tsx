import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { petService } from '../../services/petService';
import { imageService } from '../../services/imageService';
import { colors } from '../../theme/colors';
import _Icon from 'react-native-vector-icons/Ionicons';

const Icon = _Icon as React.ComponentType<{ name: string; size: number; color: string; style?: object }>;

type SelectedImage = { uri: string; base64: string };

export default function AddPetScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    bio: '',
  });

  const handlePickImage = async () => {
    const result = await imageService.selectImage();

    if (result.type === 'permission_denied') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos acessar sua galeria para adicionar uma foto ao pet. Habilite nas configurações do celular.'
      );
      return;
    }

    if (result.type === 'success') {
      setSelectedImage({ uri: result.uri, base64: result.base64 });
    }
  };

  const handleSavePet = async () => {
    if (!formData.name || !formData.species) {
      Alert.alert('Atenção', 'O nome e a espécie do pet são obrigatórios.');
      return;
    }
    if (!selectedImage) {
      Alert.alert('Atenção', 'A foto do pet é obrigatória.');
      return;
    }

    setLoading(true);

    const uploadResult = await imageService.uploadPetPhoto(selectedImage.base64);
    if (uploadResult.type === 'error') {
      setLoading(false);
      Alert.alert('Erro ao enviar foto', uploadResult.error);
      return;
    }

    const response = await petService.createPet({
      name: formData.name,
      species: formData.species,
      breed: formData.breed,
      age: parseInt(formData.age) || 0,
      bio: formData.bio,
      image_url: uploadResult.url,
    });

    setLoading(false);

    if (response.success) {
      Alert.alert('Sucesso!', `${formData.name} foi adicionado ao seu perfil.`);
      navigation.goBack();
    } else {
      Alert.alert('Erro', response.error || 'Não foi possível cadastrar o pet.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Pet</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Foto do Pet *</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="camera-outline" size={40} color={colors.primary} />
              <Text style={styles.imagePlaceholderText}>Toque para adicionar uma foto</Text>
            </View>
          )}
        </TouchableOpacity>
        {selectedImage && (
          <TouchableOpacity onPress={handlePickImage} style={styles.changePhotoLink}>
            <Text style={styles.changePhotoText}>Trocar foto</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.label}>Nome do Pet *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Arrascaeta"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <Text style={styles.label}>Espécie *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Cachorro, Gato"
          value={formData.species}
          onChangeText={(text) => setFormData({ ...formData, species: text })}
        />

        <Text style={styles.label}>Raça</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Golden Retriever"
          value={formData.breed}
          onChangeText={(text) => setFormData({ ...formData, breed: text })}
        />

        <Text style={styles.label}>Idade (anos)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 3"
          keyboardType="numeric"
          value={formData.age}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Conte um pouco sobre a personalidade do seu pet..."
          multiline
          numberOfLines={4}
          value={formData.bio}
          onChangeText={(text) => setFormData({ ...formData, bio: text })}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSavePet}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Cadastrar Pet</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8, marginTop: 15 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: colors.text,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  imagePicker: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  imagePreview: { width: '100%', height: '100%' },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F3',
    gap: 10,
  },
  imagePlaceholderText: { color: colors.primary, fontSize: 14, fontWeight: '500' },
  changePhotoLink: { alignItems: 'center', marginTop: 8 },
  changePhotoText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
