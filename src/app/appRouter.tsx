import { routes } from '@shared/config/routes';
import { RouteSetup } from '@shared/components/RouteSetup';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '@shared/app/pages/Home';
import { CitiesPage } from '@shared/app/pages/Cities';
import { CityPage } from '@shared/app/pages/City';
import { NotFoundPage } from '@shared/app/pages/NotFound';

const router = createBrowserRouter([
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
