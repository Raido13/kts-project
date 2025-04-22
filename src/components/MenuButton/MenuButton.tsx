import { FC, HTMLAttributes, ReactNode } from 'react';
import s from './MenuButton.module.scss';

interface MenuButtonProps extends HTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  onClick: () => void;
  onClose: () => void;
}

export const MenuButton: FC<MenuButtonProps> = ({ icon, onClick, onClose }) => (
  <button
    className={s.button}
    onClick={() => {
      onClick();
      onClose();
    }}
  >
    {icon}
  </button>
);
