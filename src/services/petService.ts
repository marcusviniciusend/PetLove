import { supabase } from '../lib/supabase';

export const petService = {
  // Função para buscar todos os pets cadastrados
  async getAvailablePets() {
    const { data, error } = await supabase
      .from('pets')
      .select('*');

    if (error) {
      console.error("Erro ao buscar pets no Supabase:", error);
      throw new Error("Não foi possível carregar os pets no momento.");
    }

    return data;
  }
};