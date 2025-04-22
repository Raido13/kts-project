import { NavLink } from 'react-router-dom';
import Text from '@shared/components/Text';
import s from './CustomLink.module.scss';
import cn from 'classnames';

export interface LinkProps {
  /* Путь ссылки **/
  path: string;
  /* Текст ссылки **/
  label?: string;
  /* Иконка ссылки **/
  icon?: React.ReactNode;
  /** Дополнительный classname */
  className?: string;
  /** Колбек закрытия бургера */
  onClose?: () => void;
}

export const CustomLink: React.FC<LinkProps> = ({ path, label, icon, className, onClose }) => (
  <NavLink to={path} end className={s.link}>
    {({ isActive }) => (
      <div
        className={cn(
          s.link__container,
          !(label && icon) && s.link__container_after,
          label && isActive && s.link__container_active,
          className
        )}
        onClick={onClose}
      >
        {icon}
        {label && (
          <Text tag={'p'} view={'p-18'} color={!icon && isActive ? 'accent' : 'primary'}>
            {label}
          </Text>
        )}
      </div>
    )}
  </NavLink>
);
