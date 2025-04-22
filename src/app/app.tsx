import { AppRouter } from '@shared/app/appRouter';
import { ModalRoot } from '@shared/components/Modal';
import { ToastContainer } from '@shared/components/ToastContainer';
import { RootStoreProvider } from '@shared/stores/global/rootStore/RootStoreProvider';

export const App = () => (
  <RootStoreProvider>
    <ToastContainer />
    <AppRouter />
    <ModalRoot />
  </RootStoreProvider>
);
