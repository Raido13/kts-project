import { CitiesContextProvider, ModalContextProvider, UserContextProvider } from '@shared/lib/contexts/';
import { AppRouter } from './appRouter';
import { ModalRoot } from '@shared/ui/Modal';

export const App = () => (
  <UserContextProvider>
    <CitiesContextProvider>
      <ModalContextProvider>
        <AppRouter />
        <ModalRoot />
      </ModalContextProvider>
    </CitiesContextProvider>
  </UserContextProvider>
);
