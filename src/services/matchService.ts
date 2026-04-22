import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

export const matchService = {
  async registerInteraction(targetPetId: string, action: 'like' | 'dislike') {
    // Por enquanto, não vamos salvar os 'dislikes' no banco para economizar espaço
    if (action === 'dislike') return { match: false };

    try {
      // 1. Identificar o tutor logado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { match: false };

      // 2. Pegar o pet do tutor (vamos usar o primeiro pet cadastrado como admirador)
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

      // 3. Salvar o Like no banco
      const { error: insertError } = await supabase
        .from('likes')
        .insert({ admirer_pet_id: myPetId, target_pet_id: targetPetId });

      // Ignoramos o erro silenciosamente se for um like duplicado (a constraint unique barra)
      if (insertError && !insertError.message.includes('duplicate key')) {
        console.error('Erro ao dar like:', insertError.message);
      }

      // 4. A Mágica do Match: O targetPet já curtiu o meu pet antes?
      const { data: matchData } = await supabase
        .from('likes')
        .select('id')
        .eq('admirer_pet_id', targetPetId) // Quem eu curti...
        .eq('target_pet_id', myPetId)      // ...tinha me curtido?
        .maybeSingle();

      if (matchData) {
        // MATCH! Rolou o Double Like!
        console.log(`🎉 IT'S A MATCH entre ${myPetName} e o pet ${targetPetId}!`);
        
        // Futuramente, gravaremos isso na tabela 'matches'
        return { match: true };
      }

      return { match: false };

    } catch (error) {
      console.error('Erro no fluxo de interação:', error);
      return { match: false };
    }
  }
};