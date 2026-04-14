import { supabase } from '../lib/supabase';

export const matchService = {
  // Mudamos petId para string
  async saveInteraction(petId: string, type: 'like' | 'dislike') {
    try {
      const { error } = await supabase
        .from('interactions') 
        .insert([
          { 
            pet_id: petId, 
            type: type,
            user_id: 'meu-usuario-123' // Mudamos para texto aqui também
          }
        ]);

      if (error) throw error;
      console.log(`Interação de ${type} salva para o pet ${petId}`);
    } catch (error) {
      console.error('Erro ao salvar interação:', error);
    }
  }
};