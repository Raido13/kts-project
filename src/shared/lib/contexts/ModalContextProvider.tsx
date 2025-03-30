import { FC, ReactNode, useState } from 'react';
import { ModalType } from '../types/modal';
import { ModalContext } from './ModalContext';

export const ModalContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [modal, setModal] = useState<ModalType>(null);

  const openModal = (type: ModalType) => setModal(type);
  const closeModal = () => setModal(null);

  return <ModalContext.Provider value={{ modal, openModal, closeModal }}>{children}</ModalContext.Provider>;
};
