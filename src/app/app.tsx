import { AppRouter } from '@shared/app/appRouter';
import { ModalRoot } from '@shared/components/Modal';
import { RootStoreProvider } from '@shared/contexts/RootStoreProvider';

export const App = () => (
  <RootStoreProvider>
    <AppRouter />
    <ModalRoot />
  </RootStoreProvider>
);
