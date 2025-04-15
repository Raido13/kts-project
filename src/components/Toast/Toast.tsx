import { ToastVariant, ToastAnimationType } from '@shared/types/toast';
import { FC, useEffect, useState } from 'react';
import s from './Toast.module.scss';
import cn from 'classnames';
import Text from '@shared/components/Text';
import { SuccessIcon } from '@shared/components/Icon/SuccessIcon';
import { ErrorIcon } from '@shared/components/Icon/ErrorIcon';
import CloseIcon from '@shared/components/Icon/CloseIcon';

interface ToastProps {
  variant: ToastVariant;
  onClose: () => void;
  showAnimation?: ToastAnimationType;
  message?: string;
  duration?: number;
  className?: string;
}

const icons = {
  success: <SuccessIcon height={24} width={24} color={'accent'} />,
  error: <ErrorIcon height={24} width={24} color={'secondary'} />,
};

export const Toast: FC<ToastProps> = ({
  variant,
  showAnimation = 'right',
  message,
  onClose,
  duration = 5,
  className,
}) => {
  const [isEnter, setIsEnter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(onClose, duration * 1000);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setIsEnter(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className={cn(s.toast, s[`toast_${showAnimation}`], isEnter && s[`toast--enter-${showAnimation}`], className)}>
      <Text view={'p-18'} className={s.toast__text}>
        {message}
      </Text>
      <div className={s.toast__icon}>{icons[variant]}</div>
      <div className={s.toast__close} onClick={onClose}>
        <CloseIcon height={18} width={18} color={'secondary'} />
      </div>
      <div
        className={cn(s.toast__loader, s[`toast__loader_${variant}`])}
        style={{ animationDuration: `${duration}s` }}
      />
    </div>
  );
};
