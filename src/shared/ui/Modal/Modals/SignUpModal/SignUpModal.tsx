import { HTMLAttributes, FC, useState } from 'react';
import Text from '@shared/ui/Text';
import Input from '@shared/ui/Input';
import Button from '@shared/ui/Button';
import s from './SignUpModal.module.scss';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@shared/lib/config/firebase';
import { useModalContext, useUserContext } from '@shared/lib/hooks';

export const SignUpModal: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { recordUser } = useUserContext();
  const { closeModal } = useModalContext();

  const handleSignUp = async () => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    recordUser(userCredential.user);
    closeModal();
  };

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
        <Button onClick={handleSignUp}>Sign Up</Button>
      </div>
    </div>
  );
};
