import { createContext } from 'react';
import { City } from '../types/city';

export interface CitiesContextType {
  cities: City[];
  isLoading: boolean;
  randomCity: City | null;
}

export const CitiesContext = createContext<CitiesContextType | null>(null);
