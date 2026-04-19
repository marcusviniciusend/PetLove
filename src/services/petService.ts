import { supabase } from '../lib/supabase';

export const petService = {
  // 1. Função de LEITURA (Restaurada para o Swipe funcionar)
  async getAvailablePets() {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*');

      if (error) {
        console.error('Erro do Supabase ao buscar pets:', error.message);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Falha no petService:', error);
      return []; 
    }
  },

  // 2. Função de ESCRITA (Nova, para a tela de Perfil)
  async saveProfile(petData: { name: string; breed: string; age: number }) {
    try {
      const { error } = await supabase
        .from('pets')
        .insert([
          {
            name: petData.name,
            breed: petData.breed,
            age: petData.age,
            owner_name: 'Marcus', // Fixando seu nome por enquanto
          }
        ]);

      if (error) {
        console.error('Erro do Supabase ao salvar:', error.message);
        throw error;
      }
      return true; 
    } catch (error) {
      console.error('Falha ao salvar perfil:', error);
      return false; 
    }
  }
};