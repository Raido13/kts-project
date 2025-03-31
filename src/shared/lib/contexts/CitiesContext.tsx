import { createContext } from 'react';
import { City } from '../types/city';

export interface CitiesContextType {
  cities: City[];
  isLoading: boolean;
  randomCity: City | null;
  citiesLikes: Record<string, string[]>;
  toggleLike: (cityId: string, userId: string) => void;
}

export const CitiesContext = createContext<CitiesContextType | null>(null);
