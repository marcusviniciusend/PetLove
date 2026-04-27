import { supabase } from '../lib/supabase';
import { MatchedPet } from '../types';

export type { MatchedPet };

export const matchService = {
  // 1. O Fluxo do Swipe
  async registerInteraction(targetPetId: string, action: 'like' | 'dislike') {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { match: false };

      const { data: myPets } = await supabase
        .from('pets')
        .select('id')
        .eq('tutor_id', user.id)
        .limit(1);

      if (!myPets || myPets.length === 0) {
        return { match: false, error: 'NO_PET_FOUND' };
      }

      const myPetId = myPets[0].id;

      // Se for dislike, apenas gravamos na tabela de dislikes e retornamos
      if (action === 'dislike') {
        const { error: dislikeError } = await supabase
          .from('dislikes')
          .insert({ admirer_pet_id: myPetId, target_pet_id: targetPetId });
        
        if (dislikeError) console.error('Erro ao salvar dislike:', dislikeError.message);
        
        return { match: false };
      }

      // Grava o Like
      const { error: insertError } = await supabase
        .from('likes')
        .insert({ admirer_pet_id: myPetId, target_pet_id: targetPetId });

      if (insertError && !insertError.message.includes('duplicate key')) {
        console.error('Erro ao dar like:', insertError.message);
      }

      // Checa se já havia um like do outro lado
      const { data: matchData } = await supabase
        .from('likes')
        .select('id')
        .eq('admirer_pet_id', targetPetId)
        .eq('target_pet_id', myPetId)
        .maybeSingle();

      if (matchData) {
        // O trigger SQL cria a linha em `matches` automaticamente
        return { match: true };
      }

      return { match: false };

    } catch (error) {
      console.error('Erro no fluxo de interação:', error);
      return { match: false };
    }
  },

  // 2. O Motor da Aba de Matches
  async getMyLikedPets(): Promise<MatchedPet[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Descobre quem é o meu pet
      const { data: myPets } = await supabase
        .from('pets')
        .select('id')
        .eq('tutor_id', user.id)
        .limit(1);

      if (!myPets || myPets.length === 0) return [];
      const myPetId = myPets[0].id;

      // Refactored to fetch matches and pet details in a single query using joins
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          pet1:pets!pet1_id(id, name, breed, species, tutor_id, image_url),
          pet2:pets!pet2_id(id, name, breed, species, tutor_id, image_url)
        `)
        .or(`pet1_id.eq.${myPetId},pet2_id.eq.${myPetId}`);

      if (error) throw error;
      if (!data) return [];

      // Mapeamento e deduplicação para garantir que cada pet apareça apenas uma vez
      const seenPetIds = new Set<string>();
      const uniqueMatches: MatchedPet[] = [];

      for (const m of data) {
        const p1 = m.pet1 as unknown as MatchedPet;
        const p2 = m.pet2 as unknown as MatchedPet;
        if (!p1 || !p2) continue;

        const otherPet = p1.id === myPetId ? p2 : p1;
        
        if (!seenPetIds.has(otherPet.id)) {
          seenPetIds.add(otherPet.id);
          uniqueMatches.push({ ...otherPet, match_id: m.id });
        }
      }

      return uniqueMatches;

    } catch (error) {
      console.error('Erro ao buscar matches:', error);
      return [];
    }
  }
};