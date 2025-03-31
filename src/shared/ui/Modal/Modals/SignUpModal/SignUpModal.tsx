import { HTMLAttributes, FC, useState, MouseEvent, useEffect, useCallback } from 'react';
import Text from '@shared/ui/Text';
import Input from '@shared/ui/Input';
import Button from '@shared/ui/Button';
import s from './SignUpModal.module.scss';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@shared/lib/config/firebase';
import { useModalContext, useUserContext } from '@shared/lib/hooks';
import { removeExtraEventActions } from '@shared/lib/utils/utils';

export const SignUpModal: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { recordUser } = useUserContext();
  const { closeModal } = useModalContext();

  const handleSignUp = useCallback(async () => {
    if (!email || !password) return;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    recordUser(userCredential.user);
    closeModal();
  }, [recordUser, email, password, closeModal]);

  const handleButtonSignUp = (e: MouseEvent<HTMLButtonElement>) => {
    removeExtraEventActions(e);
    handleSignUp();
  };

  const handleEnterDownSignUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      handleSignUp();
    },
    [handleSignUp]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleEnterDownSignUp);
    return () => window.removeEventListener('keydown', handleEnterDownSignUp);
  }, [handleEnterDownSignUp]);

  return (
    <div className={s.modal}>
      <Text view={'title'} weight={'bold'} tag={'p'}>
        Sign Up
      </Text>
      <div className={s.modal__field}>
        <Text view={'p-14'} tag={'p'}>
          Enter Email
        </Text>
        <Input value={email} type={'email'} onChange={setEmail} />
      </div>
      <div className={s.modal__field}>
        <Text view={'p-14'} tag={'p'}>
          Enter Password
        </Text>
        <Input value={password} type={'password'} onChange={setPassword} />
      </div>
      <div className={s.modal__action}>
        <Button onClick={handleButtonSignUp}>Sign Up</Button>
      </div>
    </div>
  );
};
