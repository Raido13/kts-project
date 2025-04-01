import { createContext } from 'react';
import { ModalType } from '@shared/types/modal';

interface ModalContextProps {
  modal: ModalType;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextProps | null>(null);
