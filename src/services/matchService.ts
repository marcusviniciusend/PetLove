import { supabase } from '../lib/supabase';

export interface MatchedPet {
  id: string;
  name: string;
  breed: string;
  species: string;
  tutor_id: string; // Adicionado para o Chat
  match_id: string; // Adicionado para o Chat
}

export const matchService = {
  // 1. O Fluxo do Swipe
  async registerInteraction(targetPetId: string, action: 'like' | 'dislike') {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { match: false };

      const { data: myPets } = await supabase
        .from('pets')
        .select('id, name')
        .eq('tutor_id', user.id)
        .limit(1);

      if (!myPets || myPets.length === 0) {
        return { match: false, error: 'NO_PET_FOUND' };
      }

      const myPetId = myPets[0].id;
      const myPetName = myPets[0].name;

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
        console.log(`🎉 IT'S A MATCH entre ${myPetName} e o pet ${targetPetId}!`);

        // Verifica se o match já existe para evitar duplicatas no banco de dados
        const { data: existingMatch } = await supabase
          .from('matches')
          .select('id')
          .or(`and(pet1_id.eq.${myPetId},pet2_id.eq.${targetPetId}),and(pet1_id.eq.${targetPetId},pet2_id.eq.${myPetId})`)
          .maybeSingle();

        if (!existingMatch) {
          // Salva o encontro definitivo na tabela matches apenas se não existir
          await supabase.from('matches').insert({
            pet1_id: myPetId,
            pet2_id: targetPetId
          });
        }

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
          pet1:pets!pet1_id(id, name, breed, species, tutor_id),
          pet2:pets!pet2_id(id, name, breed, species, tutor_id)
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