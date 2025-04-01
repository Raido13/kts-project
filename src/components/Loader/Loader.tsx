import React from 'react';
import LoaderIcon from '@shared/components/Icon/LoaderIcon';
import s from './Loader.module.scss';
import cn from 'classnames';

export type LoaderProps = {
  /** Размер */
  size?: 's' | 'm' | 'l';
  /** Дополнительный класс */
  className?: string;
  /** Цвет лоадера */
  color?: 'primary' | 'secondary' | 'accent';
};

const Loader: React.FC<LoaderProps> = ({ size, className, color, ...props }) => {
  const currentSize = { s: 24, m: 48, l: 60 }[size ?? 'l'];

  return (
    <LoaderIcon
      width={currentSize}
      height={currentSize}
      viewBox={'0 0 24 24'}
      className={cn(s.loader, className)}
      color={color ?? 'accent'}
      {...props}
    />
  );
};

export default Loader;
