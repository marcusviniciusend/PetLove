import { supabase } from '../lib/supabase';

export const matchService = {
  async registerInteraction(petId: string, type: 'like' | 'dislike') {
    try {
      const { error } = await supabase
        .from('interactions')
        .insert([
          {
            pet_id: petId,
            type: type,
            // simulação, enquanto não há tela de login
            user_id: 'meu-usuario-123', 
          }
        ]);

      if (error) throw error;
      
      console.log(`Sucesso: ${type} salvo no banco para o pet ${petId}!`);
    } catch (error) {
      console.error(`Erro ao salvar o ${type}:`, error);
    }
  }
};