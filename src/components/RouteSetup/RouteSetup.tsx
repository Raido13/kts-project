import { FC, PropsWithChildren, useEffect } from 'react';
import { Layout } from '../Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { runInAction } from 'mobx';
import { useRootStore } from '@shared/hooks';
import { observer } from 'mobx-react-lite';

interface RouterSetupProps extends PropsWithChildren {
  header: boolean;
}

export const RouteSetup: FC<RouterSetupProps> = observer(({ children, header }) => {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const { citiesStore } = useRootStore();

  useEffect(() => {
    const dispose = citiesStore.initUrlSync((path) => navigate(path, { replace: true }), pathname);

    runInAction(async () => {
      await citiesStore.initFromUrl(search);
    });

    return () => dispose();
  }, [navigate, pathname, search, citiesStore]);

  return <Layout header={header}>{children}</Layout>;
});
