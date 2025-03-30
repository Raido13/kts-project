import { CitiesContextProvider, ModalContextProvider } from '@shared/lib/contexts/';
import { AppRouter } from './appRouter';
import { ModalRoot } from '@shared/ui/Modal';

export const App = () => (
  <CitiesContextProvider>
    <ModalContextProvider>
      <AppRouter />
      <ModalRoot />
    </ModalContextProvider>
  </CitiesContextProvider>
);
