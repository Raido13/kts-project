import { HTMLAttributes, FC, MouseEvent, useCallback } from 'react';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import s from './LogoutModal.module.scss';
import { useModalContext, useUserContext } from '@shared/hooks';
import { removeExtraEventActions } from '@shared/utils/utils';
import { useRequestError } from '@shared/hooks/useRequestError';
import { logout } from '@shared/services/auth/logout';

export const LogoutModal: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const { recordUser } = useUserContext();
  const { closeModal } = useModalContext();
  const { requestError, setRequestError, clearError } = useRequestError();

  const handleLogout = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      removeExtraEventActions(e);
      const loggingOut = logout();

      if (typeof loggingOut === 'string') {
        setRequestError(loggingOut);
        return;
      }

      recordUser(null);
      clearError();
      closeModal();
    },
    [recordUser, closeModal, setRequestError, clearError]
  );

  return (
    <div className={s.modal}>
      <Text view={'title'} weight={'bold'} tag={'p'}>
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
};
