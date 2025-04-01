import { FC, PropsWithChildren, useState } from 'react';
import { ModalType } from '@shared/types/modal';
import { ModalContext } from '@shared/contexts';

export const ModalContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [modal, setModal] = useState<ModalType>(null);

  const openModal = (type: ModalType) => setModal(type);
  const closeModal = () => setModal(null);

  return <ModalContext.Provider value={{ modal, openModal, closeModal }}>{children}</ModalContext.Provider>;
};
