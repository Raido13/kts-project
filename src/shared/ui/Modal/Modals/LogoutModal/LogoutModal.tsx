import { HTMLAttributes, FC } from 'react';
import Text from '@shared/ui/Text';
import Button from '@shared/ui/Button';
import s from './LogoutModal.module.scss';
import { useModalContext, useUserContext } from '@shared/lib/hooks';

export const LogoutModal: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const { recordUser } = useUserContext();
  const { closeModal } = useModalContext();

  const handleLogout = () => {
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
