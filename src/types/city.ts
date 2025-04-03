export interface CityType {
  id: string;
  country: string;
  name: string;
  population: number;
  is_capital: boolean;
  image: string;
  likes: string[];
}

export type CityVariant = 'preview' | 'single';
