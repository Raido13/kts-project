import { createContext } from 'react';
import { CityType } from '@shared/types/city';

export interface CitiesContextType {
  cities: CityType[];
  isLoading: boolean;
  randomCity: CityType | null;
  citiesLikes: Record<string, string[]>;
  toggleLike: (cityId: string, userId: string) => void;
  citiesRequestError: string | null;
  fetchWithRetry: () => void;
}

export const CitiesContext = createContext<CitiesContextType | null>(null);
