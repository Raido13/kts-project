import { FC, PropsWithChildren, useEffect } from 'react';
import { CitiesStoreContext } from './CitiesStoreContext';
import { citiesStore } from '@shared/stores';
import { useCitiesStoreSync } from '@shared/hooks';

export const CitiesStoreContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { init } = citiesStore;

  useEffect(() => {
    init();
  }, [init]);

  useCitiesStoreSync();

  return <CitiesStoreContext.Provider value={undefined as never}>{children}</CitiesStoreContext.Provider>;
};
