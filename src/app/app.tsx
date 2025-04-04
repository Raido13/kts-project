import { AppStoreProvider } from '@shared/contexts/AppStoresProvider';
import { AppRouter } from './appRouter';
import { ModalRoot } from '@shared/components/Modal';

export const App = () => (
  <AppStoreProvider>
    <AppRouter />
    <ModalRoot />
  </AppStoreProvider>
);
