import { supabase } from '../lib/supabase';

export const matchService = {
  // Função 1: Salva o Like/Dislike (Escrita)
  async registerInteraction(petId: string, type: 'like' | 'dislike') {
    try {
      const { error } = await supabase
        .from('interactions')
        .insert([
          {
            pet_id: petId,
            type: type,
            user_id: 'meu-usuario-123', // Simulando o login
          }
        ]);

      if (error) throw error;
      console.log(`Sucesso: ${type} salvo no banco para o pet ${petId}`);
    } catch (error) {
      console.error(`Erro ao salvar o ${type}:`, error);
    }
  },

  // Função 2: Busca quem você deu Like (Leitura)
  async getMyLikedPets() {
    try {
      const { data: interactions, error: intError } = await supabase
        .from('interactions')
        .select('pet_id')
        .eq('user_id', 'meu-usuario-123')
        .eq('type', 'like');

      if (intError) throw intError;
      if (!interactions || interactions.length === 0) return [];

      const petIds = interactions.map(i => i.pet_id);

      const { data: pets, error: petError } = await supabase
        .from('pets')
        .select('*')
        .in('id', petIds);

      if (petError) throw petError;

      return pets || [];
    } catch (error) {
      console.error('Erro ao buscar matches:', error);
      return [];
    }
  }
};