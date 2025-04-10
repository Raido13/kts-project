import { ToastVariant } from '@shared/types/toast';
import { FC, useEffect } from 'react';
import s from './Toast.module.scss';
import cn from 'classnames';
import Text from '@shared/components/Text';
import { SuccessIcon } from '@shared/components/Icon/SuccessIcon';
import { ErrorIcon } from '@shared/components/Icon/ErrorIcon';
import CloseIcon from '../Icon/CloseIcon';

interface ToastProps {
  variant: ToastVariant;
  message: string;
  onClose: () => void;
  duration?: number;
  className?: string;
}

const icons = {
  success: <SuccessIcon height={24} width={24} />,
  error: <ErrorIcon height={24} width={24} />,
};

export const Toast: FC<ToastProps> = ({ variant, message, onClose, duration = 5, className }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration * 1000);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={s[`toast-container`]}>
      <div className={cn(s.toast, className)}>
        <Text view={'p-18'} className={s.toast__text}>
          {message}
        </Text>
        <div className={s.toast__icon}>{icons[variant]}</div>
        <div className={s.toast__close} onClick={onClose}>
          <CloseIcon height={18} width={18} color={'secondary'} />
        </div>
      </div>
    </div>
  );
};
