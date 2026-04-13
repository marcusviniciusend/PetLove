import { useState, useEffect } from 'react';
import { petService } from '../services/petService';

export function useSwipe() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPets() {
    try {
      setLoading(true);
      setError(null);
      
      const data = await petService.getAllPets();
      setPets(data);
    } catch (err) {
      setError('Não foi possível carregar os pets para adoção.');
    } finally {
      setLoading(false);
    }
  }

  function removePetFromQueue(petId: string | number) {
    setPets((currentPets) => currentPets.filter(pet => pet.id !== petId));
  }

  useEffect(() => {
    loadPets();
  }, []);

  return { 
    pets, 
    loading, 
    error, 
    removePetFromQueue,
    refetch: loadPets 
  };
}