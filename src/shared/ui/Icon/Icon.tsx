import * as React from 'react';
import cn from 'classnames';
import s from './Icon.module.scss';

export type IconProps = React.SVGAttributes<SVGElement> & {
  className?: string;
  color?: 'primary' | 'secondary' | 'accent';
  width?: number;
  height?: number;
};

interface IconComponentProps extends IconProps {
  children: React.ReactNode;
}

const Icon: React.FC<React.PropsWithChildren<IconComponentProps>> = ({
  className,
  color = 'primary',
  width = 24,
  height = 24,
  children,
  ...props
}) => (
  <svg width={width} height={height} className={cn(s.icon, s[`icon_${color}`], className)} {...props}>
    {children}
  </svg>
);

export default Icon;
