import { HTMLAttributes, FC, MouseEvent, useCallback } from 'react';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import s from './LogoutModal.module.scss';
import { removeExtraEventActions } from '@shared/utils/utils';
import { useRequestError, useRootStore } from '@shared/hooks';
import { observer } from 'mobx-react-lite';

export const LogoutModal: FC<HTMLAttributes<HTMLDivElement>> = observer(() => {
  const rootStoreContext = useRootStore();
  const { closeModal } = rootStoreContext.modalStore;
  const userStore = rootStoreContext.userStore;
  const { requestError, setRequestError, clearError } = useRequestError();

  const handleLogout = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      removeExtraEventActions(e);
      const loggingOut = await userStore.logout();

      if (typeof loggingOut === 'string') {
        setRequestError(loggingOut);
        return;
      }

      clearError();
      closeModal();
    },
    [closeModal, setRequestError, clearError, userStore]
  );

  return (
    <div className={s.modal}>
      <Text className={s.modal__title} view={'title'} weight={'bold'} tag={'p'}>
        Are you want to LogOff?
      </Text>
      {requestError && (
        <Text view={'p-20'} className={s.modal__error}>
          {requestError}
        </Text>
      )}
      <div className={s.modal__action}>
        <Button onClick={handleLogout}>Yes</Button>
      </div>
    </div>
  );
});
