import { createContext, Dispatch, SetStateAction } from 'react';
import { City } from '../types/city';

export interface CitiesContextType {
  cities: City[];
  setCities: Dispatch<SetStateAction<City[]>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export const CitiesContext = createContext<CitiesContextType | null>(null);
