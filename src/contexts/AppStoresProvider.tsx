import { FC, PropsWithChildren } from 'react';
import { CitiesStoreContextProvider } from './CitiesStoreContextProvider';

export const AppStoreProvider: FC<PropsWithChildren> = ({ children }) => (
  <CitiesStoreContextProvider>{children}</CitiesStoreContextProvider>
);
