import { RootStore } from '@shared/stores/global/rootStore';
import { createContext } from 'react';

export const RootStoreContext = createContext<RootStore>({} as RootStore);
