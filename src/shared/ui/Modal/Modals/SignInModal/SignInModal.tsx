import { HTMLAttributes, FC, useState } from 'react';
import Text from '@shared/ui/Text';
import Input from '@shared/ui/Input';
import Button from '@shared/ui/Button';
import s from './SignInModal.module.scss';
import { useModalContext, useUserContext } from '@shared/lib/hooks';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@shared/lib/config/firebase';
import cn from 'classnames';

export const SignInModal: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { recordUser } = useUserContext();
  const { openModal, closeModal } = useModalContext();

  const handleSignIn = async () => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    recordUser(userCredential.user);
    closeModal();
  };

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
        <Button onClick={handleSignIn}>Sign In</Button>
      </div>
    </div>
  );
};
