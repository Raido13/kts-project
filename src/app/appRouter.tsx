import { routes } from '@shared/config/routes';
import { RouteSetup } from '@shared/components/RouteSetup';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '@shared/App/pages/Home';
import { CitiesPage } from '@shared/App/pages/Cities';
import { CityPage } from '@shared/App/pages/City';
import { NotFoundPage } from '@shared/App/pages/NotFound';

const router = createHashRouter([
  {
    path: routes.home,
    element: (
      <RouteSetup header>
        <HomePage />
      </RouteSetup>
    ),
  },
  {
    path: routes.cities,
    element: (
      <RouteSetup header>
        <CitiesPage />
      </RouteSetup>
    ),
  },
  {
    path: '/cities/:id',
    element: (
      <RouteSetup header>
        <CityPage />
      </RouteSetup>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
