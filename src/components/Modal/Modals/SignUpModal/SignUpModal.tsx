import { HTMLAttributes, FC, MouseEvent, useEffect, useCallback } from 'react';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import s from './SignUpModal.module.scss';
import { User } from 'firebase/auth';
import { useForm, useModalContext, useUserContext } from '@shared/hooks';
import { removeExtraEventActions } from '@shared/utils/utils';
import { FieldType } from '@shared/types/field';
import { Form } from '@shared/components/Form';
import { useRequestError } from '@shared/hooks/useRequestError';
import { signUp } from '@shared/services/auth/signUp';

export const SignUpModal: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const { recordUser } = useUserContext();
  const { closeModal } = useModalContext();
  const { requestError, setRequestError, clearError } = useRequestError();

  const fieldSet: FieldType[] = [
    {
      name: 'email',
      label: 'Enter Email',
      type: 'email',
      value: '',
      onChange: () => {},
      validate: (value) => {
        if (!value) return 'Email is required';
        if (!(value as string).includes('@')) return 'Email must be valid';
        return null;
      },
    },
    {
      name: 'password',
      label: 'Enter Password',
      type: 'password',
      value: '',
      onChange: () => {},
      validate: (value) => {
        if (!value) return 'Password is required';
        if ((value as string).length < 6) return 'Password must be at least 6 characters';
        return null;
      },
    },
  ];

  const { formState, handleCheckboxChange, handleTextChange, validate, errors, isSubmitting, setIsSubmitting } =
    useForm(fieldSet);

  const handleSignUp = useCallback(async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    const email = formState.email as string;
    const password = formState.password as string;
    const userCredential = await signUp({ email, password });

    if (typeof userCredential === 'string') {
      setIsSubmitting(false);
      setRequestError(userCredential);
      return;
    }

    recordUser(userCredential as User);
    setIsSubmitting(false);
    clearError();
    closeModal();
  }, [
    recordUser,
    formState.email,
    formState.password,
    closeModal,
    validate,
    clearError,
    setRequestError,
    setIsSubmitting,
  ]);

  const handleButtonSignUp = (e: MouseEvent<HTMLButtonElement>) => {
    removeExtraEventActions(e);
    handleSignUp();
  };

  const handleEnterDownSignUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || isSubmitting) return;
      handleSignUp();
    },
    [handleSignUp, isSubmitting]
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
        actionButton={
          <Button disabled={isSubmitting} onClick={handleButtonSignUp}>
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </Button>
        }
        errors={errors}
        requestError={requestError}
      />
    </div>
  );
};
