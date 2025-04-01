import { HTMLAttributes, FC, MouseEvent } from 'react';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import s from './LogoutModal.module.scss';
import { useModalContext, useUserContext } from '@shared/hooks';
import { removeExtraEventActions } from '@shared/utils/utils';

export const LogoutModal: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const { recordUser } = useUserContext();
  const { closeModal } = useModalContext();

  const handleLogout = (e: MouseEvent<HTMLButtonElement>) => {
    removeExtraEventActions(e);
    recordUser(null);
    closeModal();
  };

  return (
    <div className={s.modal}>
      <Text view={'title'} weight={'bold'} tag={'p'}>
        Are you want to LogOff?
      </Text>
      <div className={s.modal__action}>
        <Button onClick={handleLogout}>Yes</Button>
      </div>
    </div>
  );
};
