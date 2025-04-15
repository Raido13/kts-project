import { FC, PropsWithChildren, useEffect } from 'react';
import { Layout } from '@shared/components/Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRootStore } from '@shared/hooks';

interface RouterSetupProps extends PropsWithChildren {
  header: boolean;
}

export const RouteSetup: FC<RouterSetupProps> = ({ children, header }) => {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const rootStore = useRootStore();

  useEffect(() => {
    rootStore.setNavigate(navigate);
    rootStore.routerStore.setLocation(pathname, search);
    return () => rootStore.dispose();
  }, [navigate, pathname, search, rootStore]);

  return <Layout header={header}>{children}</Layout>;
};
