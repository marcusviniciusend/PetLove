import { useState, useEffect } from 'react';
import { petService } from '../services/petService';

export function useSwipe() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);
      setError(null);
      // Puxando os dados reais da nuvem!
      const data = await petService.getAvailablePets();
      setPets(data || []);
    } catch (err) {
      setError("Erro ao conectar com o banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  const removePetFromList = (petId: string) => {
    setPets(prev => prev.filter(p => p.id !== petId));
  };

  return { pets, loading, error, refresh: loadPets, removePetFromList };
}