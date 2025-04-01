import { useContext } from 'react';
import { ModalContext } from '@shared/contexts';

export const useModalContext = () => {
  const modalContext = useContext(ModalContext);

  if (!modalContext) {
    throw new Error('useModalContext must be used within ModalContextProvider');
  }

  return modalContext;
};
