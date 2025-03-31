import { HTMLAttributes, FC, useState, MouseEvent, useCallback, useEffect } from 'react';
import Text from '@shared/ui/Text';
import Input from '@shared/ui/Input';
import Button from '@shared/ui/Button';
import s from './SignInModal.module.scss';
import { useModalContext, useUserContext } from '@shared/lib/hooks';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@shared/lib/config/firebase';
import cn from 'classnames';
import { removeExtraEventActions } from '@shared/lib/utils/utils';

export const SignInModal: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { recordUser } = useUserContext();
  const { openModal, closeModal } = useModalContext();

  const handleSignIn = useCallback(async () => {
    if (!email || !password) return;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    recordUser(userCredential.user);
    closeModal();
  }, [recordUser, email, password, closeModal]);

  const handleButtonSignIn = (e: MouseEvent<HTMLButtonElement>) => {
    removeExtraEventActions(e);
    handleSignIn();
  };

  const handleEnterDownSignIn = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      handleSignIn();
    },
    [handleSignIn]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleEnterDownSignIn);
    return () => window.removeEventListener('keydown', handleEnterDownSignIn);
  }, [handleEnterDownSignIn]);

  return (
    <div className={s.modal}>
      <Text view={'title'} weight={'bold'} tag={'p'}>
        Sign In
      </Text>
      <div className={cn(s.modal__field, s.modal__field_center)}>
        <Text view={'p-14'} tag={'p'}>
          Don't have an account yet?
        </Text>
        <div className={s.modal__action}>
          <Button onClick={() => openModal('sign-up')}>Yes</Button>
        </div>
      </div>
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
        <Button onClick={handleButtonSignIn}>Sign In</Button>
      </div>
    </div>
  );
};
