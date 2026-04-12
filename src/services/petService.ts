import { supabase } from '../lib/supabase';

export const petService = {
  // Função para buscar todos os pets
  async getAllPets() {
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
      return []; // Retorna um array vazio em caso de falha para não quebrar o app
    }
  }
};