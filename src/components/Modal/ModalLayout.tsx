import { FC, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';
import s from './ModalLayout.module.scss';
import CloseIcon from '@shared/components/Icon/CloseIcon';

interface ModalLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export const ModalLayout: FC<ModalLayoutProps> = ({ onClose, children, className }) => (
  <div className={s[`modal-overlay`]} onClick={onClose}>
    <div className={cn(s.modal, className)} onClick={(e) => e.stopPropagation()}>
      <div className={s.modal__close} onClick={onClose}>
        <CloseIcon height={18} width={18} color={'secondary'} />
      </div>
      {children}
    </div>
  </div>
);
