import { useState, useEffect } from 'react';
import { matchService } from '../services/matchService';
import { MatchedPet } from '../types';
import { supabase } from '../lib/supabase';

export function useMatches() {
  const [matches, setMatches] = useState<MatchedPet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();

    const channel = supabase
      .channel('matches-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'matches' },
        () => {
          fetchMatches();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    const data = await matchService.getMyLikedPets();
    setMatches(data);
    setLoading(false);
  };

  return { matches, loading, refresh: fetchMatches };
}
