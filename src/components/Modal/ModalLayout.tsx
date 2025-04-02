import { FC, HTMLAttributes, ReactNode, useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import s from './ModalLayout.module.scss';
import CloseIcon from '@shared/components/Icon/CloseIcon';

interface ModalLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export const ModalLayout: FC<ModalLayoutProps> = ({ onClose, children, className }) => {
  const [isMouseDownInsideContent, setIsMouseDownInsideContent] = useState<boolean>(false);

  const handleEscapeDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleEscapeDown);
    return () => window.removeEventListener('keydown', handleEscapeDown);
  }, [handleEscapeDown]);

  return (
    <div
      className={s[`modal-overlay`]}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isMouseDownInsideContent) onClose?.();
      }}
    >
      <div
        className={cn(s.modal, className)}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={() => setIsMouseDownInsideContent(true)}
        onMouseUp={() => setIsMouseDownInsideContent(false)}
      >
        <div className={s.modal__close} onClick={onClose}>
          <CloseIcon height={18} width={18} color={'secondary'} />
        </div>
        {children}
      </div>
    </div>
  );
};
