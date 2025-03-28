import React from 'react';
import Text from '../Text';
import cn from 'classnames';
import Loader from '../Loader';
import s from './Button.module.scss';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Состояние загрузки */
  loading?: boolean;
  /** Текст кнопки */
  children: React.ReactNode;
  /** Дополнительный класс */
  className?: string;
  /** Стейт для скелетона */
  isSkeletonLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  loading,
  disabled,
  children,
  className,
  isSkeletonLoading = false,
  ...props
}) =>
  isSkeletonLoading ? (
    <div className={cn(s.button__skeleton, className)} />
  ) : (
    <button
      className={cn(s.button, loading && s.button_loading, disabled && s.button_disabled, className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader className={s.button__loader} size={'s'} />}
      <Text className={s.button__text} view={'button'} tag={'p'}>
        {children}
      </Text>
    </button>
  );
export default Button;
