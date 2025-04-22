import { FC, PropsWithChildren } from 'react';
import { RootStoreContext } from './RootStoreContext';
import { store } from '@shared/stores/global/rootStore';

export const RootStoreProvider: FC<PropsWithChildren> = ({ children }) => (
  <RootStoreContext.Provider value={store}>{children}</RootStoreContext.Provider>
);
