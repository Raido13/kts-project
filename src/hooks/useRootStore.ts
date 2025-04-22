import { RootStoreContext } from '@shared/stores/global/rootStore/RootStoreContext';
import { useContext } from 'react';

export const useRootStore = () => {
  const rootStoreContext = useContext(RootStoreContext);

  if (!rootStoreContext) {
    throw new Error('RootStoreContext must be used within RootStoreProvider');
  }

  return rootStoreContext;
};
