import { supabase } from '../lib/supabase';

export const petService = {
  // 1. Cadastrar um novo pet
  async createPet(petData: { name: string, species: string, breed: string, age: number, bio: string }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: false, error: 'Usuário não autenticado' };

      const { data, error } = await supabase
        .from('pets')
        .insert([{ ...petData, tutor_id: user.id }])
        .select();

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Erro inesperado ao cadastrar pet.' };
    }
  },

  // 2. Listar os pets do tutor logado
  async getMyPets() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('tutor_id', user.id);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar meus pets:', error);
      return [];
    }
  },

  // 3. Buscar pets para a tela de Swipe (A peça que faltava!)
  async getAvailablePets() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Traz todos os pets do banco, EXCETO os do próprio usuário logado
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .neq('tutor_id', user.id)
        .limit(30);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar pets disponíveis:', error);
      throw error;
    }
  }
};