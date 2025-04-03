import { FC } from 'react';
import { ModalLayout } from './ModalLayout';
import { CreateCityModal, LogoutModal, SignInModal, SignUpModal } from './Modals';
import { observer } from 'mobx-react-lite';
import { uiStore } from '@shared/stores/uiStore';

export const ModalRoot: FC = observer(() => {
  const { modal, closeModal } = uiStore;

  if (!modal) return null;

  return (
    <ModalLayout onClose={closeModal}>
      {
        {
          'sign-up': <SignUpModal />,
          'sign-in': <SignInModal />,
          'add-city': <CreateCityModal />,
          'log-out': <LogoutModal />,
        }[modal]
      }
    </ModalLayout>
  );
});
