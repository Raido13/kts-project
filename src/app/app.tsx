import { AppRouter } from '@shared/App/appRouter';
import { ModalRoot } from '@shared/components/Modal';
import { ToastContainer } from '@shared/components/ToastContainer';
import { RootStoreProvider } from '@shared/contexts/RootStoreProvider';

export const App = () => (
  <RootStoreProvider>
    <ToastContainer />
    <AppRouter />
    <ModalRoot />
  </RootStoreProvider>
);
