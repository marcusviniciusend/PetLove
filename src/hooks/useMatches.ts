import { useState, useEffect } from 'react';
import { matchService } from '../services/matchService';
import { MatchedPet } from '../types';

export function useMatches() {
  const [matches, setMatches] = useState<MatchedPet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    const data = await matchService.getMyLikedPets();
    setMatches(data);
    setLoading(false);
  };

  return { matches, loading, refresh: fetchMatches };
}