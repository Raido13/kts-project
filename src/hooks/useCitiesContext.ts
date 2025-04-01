import { useContext } from 'react';
import { CitiesContext } from '@shared/contexts';

export const useCitiesContext = () => {
  const citiesContext = useContext(CitiesContext);

  if (!citiesContext) {
    throw new Error('useCitiesContext must be used within CitiesContextProvider');
  }

  return citiesContext;
};
