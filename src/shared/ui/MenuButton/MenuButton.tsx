import { FC, HTMLAttributes, ReactNode } from 'react';
import s from './MenuButton.module.scss';

interface MenuButtonProps extends HTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  onClick: () => void;
}

export const MenuButton: FC<MenuButtonProps> = ({ icon, onClick }) => (
  <button className={s.button} onClick={onClick}>
    {icon}
  </button>
);
