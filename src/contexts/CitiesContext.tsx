import { createContext } from 'react';
import { City } from '@shared/types/city';

export interface CitiesContextType {
  cities: City[];
  isLoading: boolean;
  randomCity: City | null;
  citiesLikes: Record<string, string[]>;
  toggleLike: (cityId: string, userId: string) => void;
  citiesRequestError: string | null;
  fetchWithRetry: () => void;
}

export const CitiesContext = createContext<CitiesContextType | null>(null);
