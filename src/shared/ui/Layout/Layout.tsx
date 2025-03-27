import { HTMLAttributes } from 'react';
import { Header } from '../Header';
import LogoIcon from '../Icon/LogoIcon';
import UserIcon from '../Icon/UserIcon';
import { HOME } from '@shared/lib/constants/links';

interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** Хедер компонент */
  header?: boolean;
  /** Компонент для отрисовки */
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ header = true, children }) => (
  <div>
    {header && (
      <Header
        logoIcon={<LogoIcon />}
        homePath={HOME}
        links={[
          { label: 'test', path: HOME },
          { label: 'test2', path: HOME },
          { label: 'test3', path: HOME },
        ]}
        menuItems={[{ icon: <UserIcon />, path: HOME }]}
      />
    )}
    {children}
  </div>
);
