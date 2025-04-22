import { FC, PropsWithChildren, useEffect } from 'react';
import { Layout } from '@shared/components/Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRootStore } from '@shared/hooks';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

interface RouterSetupProps extends PropsWithChildren {
  header: boolean;
}

export const RouteSetup: FC<RouterSetupProps> = observer(({ children, header }) => {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const rootStore = useRootStore();
  const { setNavigate, dispose } = rootStore;
  const { openModal } = rootStore.modalStore;
  const isAppReady = rootStore.isAppReady;
  const requestError = rootStore.citiesStore.requestError;
  const mostLikedCityId = rootStore.citiesDataStore.mostLikedCity?.id;
  const user = rootStore.userStore.user;
  const routerStore = rootStore.routerStore;

  useEffect(() => {
    setNavigate(navigate);
    routerStore.setLocation(pathname, search);
    return () => {
      runInAction(() => dispose());
    };
  }, [navigate, pathname, search, setNavigate, dispose, routerStore]);

  return (
    <Layout
      isAppReady={isAppReady}
      requestError={requestError}
      mostLikedCityId={mostLikedCityId}
      header={header}
      openModal={openModal}
      pathname={pathname}
      user={user}
    >
      {children}
    </Layout>
  );
});
