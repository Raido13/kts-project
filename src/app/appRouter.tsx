import { routes } from '@shared/lib/config/routes';
import { Layout } from '@shared/ui/Layout/Layout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '../pages/Home';
import { CitiesPage } from '../pages/Cities';
import { CityPage } from '../pages/City';

const router = createBrowserRouter([
  {
    path: routes.home,
    element: (
      <Layout header>
        <HomePage />
      </Layout>
    ),
  },
  {
    path: routes.cities,
    element: (
      <Layout header>
        <CitiesPage />
      </Layout>
    ),
  },
  {
    path: '/cities/:id',
    element: (
      <Layout header>
        <CityPage />
      </Layout>
    ),
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
