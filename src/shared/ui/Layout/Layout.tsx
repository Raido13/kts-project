import { HTMLAttributes } from 'react';
import { Header } from '../Header';
import LogoIcon from '../Icon/LogoIcon';
import UserIcon from '../Icon/UserIcon';

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
        homePath={'/'}
        links={[
          { label: 'test', path: '/' },
          { label: 'test2', path: '/' },
          { label: 'test3', path: '/' },
        ]}
        menuItems={[{ icon: <UserIcon />, path: '/' }]}
      />
    )}
    {children}
  </div>
);
