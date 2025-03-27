import { CitiesContextProvider } from '@shared/lib/contexts/';
import { AppRouter } from './appRouter';

export const App = () => (
  <CitiesContextProvider>
    <AppRouter />
  </CitiesContextProvider>
);
