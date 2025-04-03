import { routes } from '@shared/config/routes';
import { Layout } from '@shared/components/Layout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '@shared/App/pages/Home';
import { CitiesPage } from '@shared/App/pages/Cities';
import { CityPage } from '@shared/App/pages/City';
import { NotFoundPage } from '@shared/App/pages/NotFound';

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
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
