import { FC } from 'react';
import { useModalContext } from '@shared/hooks/useModalContext';
import { ModalLayout } from './ModalLayout';
import { CreateCardModal, LogoutModal, SignInModal, SignUpModal } from './Modals';

export const ModalRoot: FC = () => {
  const { modal, closeModal } = useModalContext();

  if (!modal) return null;

  return (
    <ModalLayout onClose={closeModal}>
      {
        {
          'sign-up': <SignUpModal />,
          'sign-in': <SignInModal />,
          'add-card': <CreateCardModal />,
          'log-out': <LogoutModal />,
        }[modal]
      }
    </ModalLayout>
  );
};
