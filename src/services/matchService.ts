import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

export const matchService = {
  // 1. O Fluxo do Swipe
  async registerInteraction(targetPetId: string, action: 'like' | 'dislike') {
    if (action === 'dislike') return { match: false };

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { match: false };

      const { data: myPets } = await supabase
        .from('pets')
        .select('id, name')
        .eq('tutor_id', user.id)
        .limit(1);

      if (!myPets || myPets.length === 0) {
        Alert.alert('Atenção', 'Você precisa cadastrar um pet antes de dar likes!');
        return { match: false };
      }

      const myPetId = myPets[0].id;
      const myPetName = myPets[0].name;

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
        
        // NOVIDADE: Salva o encontro definitivo na tabela matches!
        await supabase.from('matches').insert({
          pet1_id: myPetId,
          pet2_id: targetPetId
        });

        return { match: true };
      }

      return { match: false };

    } catch (error) {
      console.error('Erro no fluxo de interação:', error);
      return { match: false };
    }
  },

  // 2. O Motor da Aba de Matches
  async getMyLikedPets() {
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

      // Busca todos os matches onde o meu pet está envolvido (seja como pet1 ou pet2)
      const { data: matches } = await supabase
        .from('matches')
        .select('*')
        .or(`pet1_id.eq.${myPetId},pet2_id.eq.${myPetId}`);

      if (!matches || matches.length === 0) return [];

      // Isola apenas os IDs dos "outros" pets (os crushes)
      const otherPetIds = matches.map(m => m.pet1_id === myPetId ? m.pet2_id : m.pet1_id);

      // Vai na tabela de pets e busca as informações (nome, raça) para desenhar os cards na tela
      const { data: matchedPets } = await supabase
        .from('pets')
        .select('id, name, breed, species')
        .in('id', otherPetIds);

      return matchedPets || [];

    } catch (error) {
      console.error('Erro ao buscar matches:', error);
      return [];
    }
  }
};