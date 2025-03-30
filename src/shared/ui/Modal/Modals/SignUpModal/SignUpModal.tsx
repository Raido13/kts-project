import { HTMLAttributes, FC, useState } from 'react';
import Text from '@shared/ui/Text';
import Input from '@shared/ui/Input';
import Button from '@shared/ui/Button';
import s from './SignUpModal.module.scss';

export const SignUpModal: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

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
        <Button>Sign Up</Button>
      </div>
    </div>
  );
};
