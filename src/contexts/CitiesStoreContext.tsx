import { createContext } from 'react';
import { citiesStore } from '@shared/stores/citiesStore';

export const CitiesStoreContext = createContext<typeof citiesStore | null>(null);
