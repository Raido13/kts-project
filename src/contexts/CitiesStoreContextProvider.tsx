import { FC, PropsWithChildren, useEffect } from 'react';
import { CitiesStoreContext } from './CitiesStoreContext';
import { citiesStore } from '@shared/stores';

export const CitiesStoreContextProvider: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    citiesStore.init();
  }, []);

  return <CitiesStoreContext.Provider value={citiesStore}>{children}</CitiesStoreContext.Provider>;
};
