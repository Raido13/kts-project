import { HTMLAttributes, useState } from 'react';
import { CustomLink } from '@shared/components/CustomLink';
import s from './Header.module.scss';
import cn from 'classnames';
import { MenuButton } from '@shared/components/MenuButton';
import BurgerIcon from '@shared/components/Icon/BurgerIcon';

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

export const Header: React.FC<HeaderProps> = ({ logoIcon, homePath, links, menuItems, className }) => {
  const [isBurger, setIsBurger] = useState(false);

  const closeBurger = () => {
    setIsBurger(false);
  };

  return (
    <header className={cn(s.header, className)}>
      <div className={s.header__logo}>
        <CustomLink icon={logoIcon} path={homePath} />
      </div>
      <nav className={cn(s.header__navigation, isBurger && s.header__navigation_burger)} role="navigation">
        <ul className={s.header__links}>
          {links.map((link) => (
            <li key={link.label}>
              <CustomLink onClose={closeBurger} className={s.header__link} {...link} />
            </li>
          ))}
        </ul>
        <ul className={s.header__menu}>
          {menuItems.map((item, idx) => (
            <li className={s[`header__menu-item`]} key={idx}>
              <MenuButton onClose={closeBurger} {...item} />
            </li>
          ))}
        </ul>
      </nav>
      <div className={s.header__burger} onClick={() => setIsBurger(!isBurger)}>
        <BurgerIcon width={18} height={12} color={'secondary'} />
      </div>
    </header>
  );
};
