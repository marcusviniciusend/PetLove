import { useEffect } from 'react';
import { petService } from '../services/petService';
import { useSwipeStore } from '../stores/swipeStore';

export function useSwipe() {
  const { pets, loading, error, setPets, setLoading, setError, removePet } = useSwipeStore();

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await petService.getAvailablePets();
      setPets(data || []);
    } catch {
      setError('Erro ao conectar com o banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  return { pets, loading, error, refresh: loadPets, removePetFromList: removePet };
}
