import { HTMLAttributes, useEffect } from 'react';
import { Header } from '@shared/components/Header';
import LogoIcon from '@shared/components/Icon/LogoIcon';
import UserIcon from '@shared/components/Icon/UserIcon';
import PlusIcon from '@shared/components/Icon/PlusIcon';
import { HOME, CITIES } from '@shared/constants/links';
import { useLocation } from 'react-router-dom';
import Text from '@shared/components/Text';
import s from './Layout.module.scss';
import { observer } from 'mobx-react-lite';
import { uiStore } from '@shared/stores/uiStore';
import { userStore } from '@shared/stores/userStore';
import { citiesStore } from '@shared/stores';

interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** Хедер компонент */
  header?: boolean;
  /** Компонент для отрисовки */
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = observer(({ header = true, children }) => {
  const { mostLikedCity, requestError } = citiesStore;
  const { pathname } = useLocation();
  const { openModal } = uiStore;
  const { user } = userStore;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  if (requestError) {
    return (
      <div className={s.error}>
        <Text view={'title'} tag={'p'} weight={'bold'} className={s.error__title}>
          Request Error
        </Text>
        <Text view={'p-20'} tag={'p'} weight={'bold'} color={'secondary'} className={s.error__description}>
          Please try again later
        </Text>
      </div>
    );
  }

  const nextAuthModal = user === null ? 'sign-in' : 'log-out';

  return (
    <div>
      {header && (
        <Header
          logoIcon={<LogoIcon />}
          homePath={HOME}
          links={[
            { label: 'Home', path: HOME },
            { label: 'Cities', path: CITIES },
            { label: 'Good Choice', path: mostLikedCity ? `${CITIES}/${mostLikedCity.id}` : '' },
          ]}
          menuItems={[
            { icon: <UserIcon />, onClick: () => openModal(nextAuthModal) },
            {
              icon: <PlusIcon height={24} width={24} color={'primary'} />,
              onClick: () => openModal(!user ? 'sign-in' : 'add-city'),
            },
          ]}
        />
      )}
      {children}
    </div>
  );
});
