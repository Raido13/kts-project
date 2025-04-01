import { HTMLAttributes } from 'react';
import { CustomLink } from '@shared/components/CustomLink';
import s from './Header.module.scss';
import cn from 'classnames';
import { MenuButton } from '@shared/components/MenuButton';

export interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Логотип */
  logoIcon: React.ReactNode;
  /** Ссылка на логотипе */
  homePath: string;
  /** Ссылки навигации */
  links: {
    label: string;
    path: string;
  }[];
  /** Ссылки навигации */
  menuItems: {
    icon: React.ReactNode;
    onClick: () => void;
  }[];
  /** Дополнительный classname */
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ logoIcon, homePath, links, menuItems, className }) => (
  <header className={cn(s.header, className)}>
    <div className={s.header__logo}>
      <CustomLink icon={logoIcon} path={homePath} />
    </div>
    <nav className={s.header__navigation} role="navigation">
      <ul className={s.header__links}>
        {links.map((link) => (
          <li className={s.header__link} key={link.label}>
            <CustomLink {...link} />
          </li>
        ))}
      </ul>
      <ul className={s.header__menu}>
        {menuItems.map((item, idx) => (
          <li className={s[`header__menu-item`]} key={idx}>
            <MenuButton {...item} />
          </li>
        ))}
      </ul>
    </nav>
  </header>
);
