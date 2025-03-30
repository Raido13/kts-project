import { HTMLAttributes, useEffect } from 'react';
import { Header } from '../Header';
import LogoIcon from '../Icon/LogoIcon';
import UserIcon from '../Icon/UserIcon';
import { HOME, CITIES } from '@shared/lib/constants/links';
import { useCitiesContext } from '@shared/lib/hooks/useCitiesContext';
import { useLocation } from 'react-router-dom';
import { useModalContext } from '@shared/lib/hooks/useModalContext';

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

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
          menuItems={[{ icon: <UserIcon />, onClick: () => openModal('sign-up') }]}
        />
      )}
      {children}
    </div>
  );
};
