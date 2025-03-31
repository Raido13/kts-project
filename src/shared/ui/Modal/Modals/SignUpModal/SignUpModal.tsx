import { HTMLAttributes, FC, MouseEvent, useEffect, useCallback } from 'react';
import Text from '@shared/ui/Text';
import Button from '@shared/ui/Button';
import s from './SignUpModal.module.scss';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@shared/lib/config/firebase';
import { useForm, useModalContext, useUserContext } from '@shared/lib/hooks';
import { removeExtraEventActions } from '@shared/lib/utils/utils';
import { FieldType } from '@shared/lib/types/field';
import { Form } from '@shared/ui/Form';

export const SignUpModal: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const { recordUser } = useUserContext();
  const { closeModal } = useModalContext();

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

  const handleSignUp = useCallback(async () => {
    const email = formState.email as string;
    const password = formState.password as string;
    if (!email || !password) return;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    recordUser(userCredential.user);
    closeModal();
  }, [recordUser, formState.email, formState.password, closeModal]);

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
      <Form
        fields={fieldSet}
        formState={formState}
        handleTextChange={handleTextChange}
        handleCheckboxChange={handleCheckboxChange}
        actionButton={<Button onClick={handleButtonSignUp}>Sign Up</Button>}
      />
    </div>
  );
};
