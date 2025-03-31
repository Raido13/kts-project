import { HTMLAttributes, FC, MouseEvent, useCallback, useEffect } from 'react';
import Text from '@shared/ui/Text';
import Button from '@shared/ui/Button';
import s from './SignInModal.module.scss';
import { useForm, useModalContext, useUserContext } from '@shared/lib/hooks';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@shared/lib/config/firebase';
import cn from 'classnames';
import { removeExtraEventActions } from '@shared/lib/utils/utils';
import { Form } from '@shared/ui/Form';
import { FieldType } from '@shared/lib/types/field';

export const SignInModal: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const { recordUser } = useUserContext();
  const { openModal, closeModal } = useModalContext();

  const fieldSet: FieldType[] = [
    {
      name: 'email',
      label: 'Enter Email',
      type: 'email',
      value: '',
      onChange: () => {},
    },
    {
      name: 'password',
      label: 'Enter Password',
      type: 'password',
      value: '',
      onChange: () => {},
    },
  ];

  const { formState, handleCheckboxChange, handleTextChange } = useForm(fieldSet);

  const handleSignIn = useCallback(async () => {
    const email = formState.email as string;
    const password = formState.password as string;
    if (!email || !password) return;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    recordUser(userCredential.user);
    closeModal();
  }, [recordUser, formState.email, formState.password, closeModal]);

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
      <Form
        fields={fieldSet}
        formState={formState}
        handleTextChange={handleTextChange}
        handleCheckboxChange={handleCheckboxChange}
        actionButton={<Button onClick={handleButtonSignIn}>Sign In</Button>}
      />
    </div>
  );
};
