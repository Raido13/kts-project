import { HTMLAttributes, useEffect } from 'react';
import { Header } from '@shared/components/Header';
import LogoIcon from '@shared/components/Icon/LogoIcon';
import UserIcon from '@shared/components/Icon/UserIcon';
import PlusIcon from '@shared/components/Icon/PlusIcon';
import { HOME, CITIES } from '@shared/constants/links';
import { useCitiesContext, useUserContext } from '@shared/hooks';
import { useLocation } from 'react-router-dom';
import { useModalContext } from '@shared/hooks';

interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** Хедер компонент */
  header?: boolean;
  /** Компонент для отрисовки */
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ header = true, children }) => {
  const { randomCity } = useCitiesContext();
  const { pathname } = useLocation();
  const { openModal } = useModalContext();
  const { user } = useUserContext();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

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
            ...(randomCity ? [{ label: 'Good Choice', path: `${CITIES}/${randomCity.id}` }] : []),
          ]}
          menuItems={[
            { icon: <UserIcon />, onClick: () => openModal(nextAuthModal) },
            ...(user
              ? [{ icon: <PlusIcon height={24} width={24} color={'primary'} />, onClick: () => openModal('add-card') }]
              : []),
          ]}
        />
      )}
      {children}
    </div>
  );
};
