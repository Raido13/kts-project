import { useContext } from 'react';
import { CitiesContext } from '../contexts/CitiesContext';

export const useCitiesContext = () => {
  const citiesContext = useContext(CitiesContext);

  if (!citiesContext) {
    throw new Error('useCitiesContext must be used within CitiesProvider');
  }

  return citiesContext;
};
