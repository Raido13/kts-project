import React from 'react';
import Text from '@shared/components/Text';
import cn from 'classnames';
import Loader from '@shared/components/Loader';
import s from './Button.module.scss';
import { useMinLoading } from '@shared/hooks';
import { observer } from 'mobx-react-lite';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Состояние загрузки */
  loading?: boolean;
  /** Текст кнопки */
  children: React.ReactNode;
  /** Дополнительный класс */
  className?: string;
  /** Стейт для скелетона */
  skeletonLoading?: boolean;
};

const Button: React.FC<ButtonProps> = observer(
  ({ loading, disabled, children, className, skeletonLoading, ...props }) => {
    const { isLoading } = useMinLoading();

    return isLoading && skeletonLoading ? (
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
  }
);
export default Button;
