import { CitiesContextProvider, ModalContextProvider, UserContextProvider } from '@shared/contexts';
import { AppRouter } from './appRouter';
import { ModalRoot } from '@shared/components/Modal';

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
