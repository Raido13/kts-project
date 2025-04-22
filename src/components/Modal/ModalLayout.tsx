import { FC, HTMLAttributes, ReactNode, useCallback, useEffect, useRef, MouseEvent } from 'react';
import cn from 'classnames';
import s from './ModalLayout.module.scss';
import CloseIcon from '@shared/components/Icon/CloseIcon';

interface ModalLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export const ModalLayout: FC<ModalLayoutProps> = ({ onClose, children, className }) => {
  const mouseDownTarget = useRef<EventTarget | null>(null);

  const handleEscapeDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    },
    [onClose]
  );

  const handleMouseDown = (e: MouseEvent) => {
    mouseDownTarget.current = e.target;
  };

  const handleClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget && mouseDownTarget.current === e.currentTarget) onClose?.();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEscapeDown);
    return () => window.removeEventListener('keydown', handleEscapeDown);
  }, [handleEscapeDown]);

  return (
    <div className={s[`modal-overlay`]} onClick={handleClick} onMouseDown={handleMouseDown}>
      <div className={cn(s.modal, className)} onClick={(e) => e.stopPropagation()}>
        <div className={s.modal__close} onClick={onClose}>
          <CloseIcon height={18} width={18} color={'secondary'} />
        </div>
        {children}
      </div>
    </div>
  );
};
