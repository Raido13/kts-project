import { FC, PropsWithChildren, useEffect } from 'react';
import { Layout } from '../Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { citiesStore } from '@shared/stores';
import { runInAction } from 'mobx';

interface RouterSetupProps extends PropsWithChildren {
  header: boolean;
}

export const RouteSetup: FC<RouterSetupProps> = ({ children, header }) => {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  useEffect(() => {
    const dispose = citiesStore.initUrlSync((path) => navigate(path, { replace: true }), pathname);

    runInAction(() => {
      citiesStore.initFromUrl(search);
    });

    return () => dispose();
  }, [navigate, pathname, search]);

  return <Layout header={header}>{children}</Layout>;
};
