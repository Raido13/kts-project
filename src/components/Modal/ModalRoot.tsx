import { FC } from 'react';
import { ModalLayout } from './ModalLayout';
import { CreateCityModal, LogoutModal, SignInModal, SignUpModal } from './Modals';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@shared/hooks';

export const ModalRoot: FC = observer(() => {
  const rootStoreContext = useRootStore();
  const { modal, closeModal } = rootStoreContext.modalStore;

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
