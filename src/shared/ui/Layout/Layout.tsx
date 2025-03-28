import { HTMLAttributes } from 'react';
import { Header } from '../Header';
import LogoIcon from '../Icon/LogoIcon';
import UserIcon from '../Icon/UserIcon';
import { HOME, CITIES } from '@shared/lib/constants/links';
import { useCitiesContext } from '@shared/lib/hooks/useCitiesContext';

interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** Хедер компонент */
  header?: boolean;
  /** Компонент для отрисовки */
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ header = true, children }) => {
  const { randomCity } = useCitiesContext();

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
          menuItems={[{ icon: <UserIcon />, path: HOME }]}
        />
      )}
      {children}
    </div>
  );
};
