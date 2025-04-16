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
  const { isAppReady, citiesDataStore } = rootStore;
  const { requestError } = rootStore.citiesStore;
  const { mostLikedCity } = citiesDataStore;
  const { openModal } = rootStore.modalStore;
  const { user } = rootStore.userStore;

  useEffect(() => {
    rootStore.setNavigate(navigate);
    rootStore.routerStore.setLocation(pathname, search);
    return () => {
      runInAction(() => {
        rootStore.dispose();
      });
    };
  }, [navigate, pathname, search, rootStore]);

  return (
    <Layout
      isAppReady={isAppReady}
      requestError={requestError}
      mostLikedCityId={mostLikedCity?.id}
      header={header}
      openModal={openModal}
      pathname={pathname}
      user={user}
    >
      {children}
    </Layout>
  );
});
