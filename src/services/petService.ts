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

      // 1. Descobrir qual o meu pet logado
      const { data: myPets } = await supabase.from('pets').select('id').eq('tutor_id', user.id).limit(1);
      if (!myPets || myPets.length === 0) return [];
      const myPetId = myPets[0].id;

      // 2. Buscar IDs de pets que já dei LIKE ou DISLIKE
      const [likes, dislikes] = await Promise.all([
        supabase.from('likes').select('target_pet_id').eq('admirer_pet_id', myPetId),
        supabase.from('dislikes').select('target_pet_id').eq('admirer_pet_id', myPetId)
      ]);

      // Juntamos todos os IDs que devem ser escondidos
      const interactedIds = [
        ...(likes.data?.map(l => l.target_pet_id) || []),
        ...(dislikes.data?.map(d => d.target_pet_id) || [])
      ];

      // 3. Montar a query principal excluindo meus pets e os já interagidos
      let query = supabase.from('pets').select('*').neq('tutor_id', user.id);

      if (interactedIds.length > 0) {
        const cleanIds = [...new Set(interactedIds)].filter(id => !!id);
        // Correção da sintaxe: para o operador 'in' dentro de 'not', 
        // os valores PRECISAM estar entre parênteses.
        query = query.not('id', 'in', `(${cleanIds.join(',')})`);
      }

      const { data, error } = await query.limit(30);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar pets disponíveis:', error);
      throw error;
    }
  }
};