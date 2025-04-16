import { HTMLAttributes, useEffect } from 'react';
import { Header } from '@shared/components/Header';
import LogoIcon from '@shared/components/Icon/LogoIcon';
import UserIcon from '@shared/components/Icon/UserIcon';
import PlusIcon from '@shared/components/Icon/PlusIcon';
import { HOME, CITIES } from '@shared/constants/links';
import Text from '@shared/components/Text';
import s from './Layout.module.scss';
import Loader from '@shared/components/Loader';
import { ModalType } from '@shared/types/modal';
import { User } from 'firebase/auth';

interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  isAppReady: boolean;
  requestError: string | null;
  mostLikedCityId?: string;
  openModal: (modal: ModalType) => void;
  pathname: string;
  user: User | null;
  /** Хедер компонент */
  header?: boolean;
  /** Компонент для отрисовки */
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  header = true,
  isAppReady,
  requestError,
  mostLikedCityId,
  openModal,
  pathname,
  user,
  children,
}) => {
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

  return !isAppReady ? (
    <div className={s.loading}>
      <Loader size={'l'} />
    </div>
  ) : (
    <>
      {header && (
        <Header
          logoIcon={<LogoIcon />}
          homePath={HOME}
          links={[
            { label: 'Home', path: HOME },
            { label: 'Cities', path: CITIES },
            { label: 'Good Choice', path: `${CITIES}/${mostLikedCityId}` },
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
    </>
  );
};
