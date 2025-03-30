import { FC } from 'react';
import { useModalContext } from '@shared/lib/hooks/useModalContext';
import { ModalLayout } from './ModalLayout';
import { CreateCardModal, SignInModal, SignUpModal } from './Modals';

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
        }[modal]
      }
    </ModalLayout>
  );
};
