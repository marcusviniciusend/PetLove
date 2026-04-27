import { supabase } from '../lib/supabase';

export const petService = {
  // 1. Cadastrar um novo pet
  async createPet(petData: { name: string; species: string; breed: string; age: number; bio: string; image_url?: string }) {
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

  // 3. Buscar pets para a tela de Swipe (Com RPC Otimizado)
  async getAvailablePets() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // 1. Descobrir qual o meu pet logado
      const { data: myPets } = await supabase.from('pets').select('id').eq('tutor_id', user.id).limit(1);
      if (!myPets || myPets.length === 0) return [];
      const myPetId = myPets[0].id;

      // 2. Chamar a função SQL nativa (RPC) que já traz os pets filtrados
      const { data, error } = await supabase.rpc('get_unseen_pets', {
        my_tutor_id: user.id,
        my_pet_uuid: myPetId,
        limit_count: 30
      });

      if (error) {
        console.error('Erro na RPC get_unseen_pets:', error.message);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar pets disponíveis:', error);
      throw error;
    }
  }
};