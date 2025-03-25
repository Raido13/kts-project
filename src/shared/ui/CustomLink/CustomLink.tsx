import { NavLink } from 'react-router-dom';
import Text from '../Text';
import s from './CustomLink.module.scss';
import cn from 'classnames';

export interface LinkProps {
  path: string;
  label?: string;
  icon?: React.ReactNode;
}

export const CustomLink: React.FC<LinkProps> = ({ path, label, icon }) => (
  <NavLink to={path} end className={({ isActive }) => cn(s.link, isActive ? s.link_active : '')}>
    {icon}
    {label && (
      <Text tag={'p'} view={'p-18'} color={'primary'}>
        {label}
      </Text>
    )}
  </NavLink>
);
