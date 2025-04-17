import { FC } from 'react';
import { ModalLayout } from './ModalLayout';
import { CreateCityModal, LogoutModal, SignInModal, SignUpModal, CommentsModal } from './Modals';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@shared/hooks';

export const ModalRoot: FC = observer(() => {
  const rootStore = useRootStore();
  const { closeModal } = rootStore.modalStore;
  const modal = rootStore.modalStore.modal;

  if (!modal) return null;

  return (
    <ModalLayout onClose={closeModal}>
      {
        {
          'sign-up': <SignUpModal />,
          'sign-in': <SignInModal />,
          'comments': <CommentsModal />,
          'add-city': <CreateCityModal />,
          'log-out': <LogoutModal />,
        }[modal]
      }
    </ModalLayout>
  );
});
