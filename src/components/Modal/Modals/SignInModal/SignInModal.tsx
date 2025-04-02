import { HTMLAttributes, FC, MouseEvent, useCallback, useEffect } from 'react';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import s from './SignInModal.module.scss';
import { useForm, useModalContext, useUserContext } from '@shared/hooks';
import { removeExtraEventActions } from '@shared/utils/utils';
import { Form } from '@shared/components/Form';
import { FieldType } from '@shared/types/field';
import { signIn } from '@shared/services/auth/signIn';
import { useRequestError } from '@shared/hooks/useRequestError';
import { User } from 'firebase/auth';

export const SignInModal: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const { recordUser } = useUserContext();
  const { openModal, closeModal } = useModalContext();
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

  const handleSignIn = useCallback(async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    const email = formState.email as string;
    const password = formState.password as string;
    const userCredential = await signIn({ email, password });

    if (typeof userCredential === 'string') {
      setRequestError(userCredential);
      setIsSubmitting(false);
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

  const handleButtonSignIn = (e: MouseEvent<HTMLButtonElement>) => {
    removeExtraEventActions(e);
    handleSignIn();
  };

  const handleEnterDownSignIn = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || isSubmitting) return;
      handleSignIn();
    },
    [handleSignIn, isSubmitting]
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
      <div className={s.modal__field}>
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
        actionButton={
          <Button disabled={isSubmitting} onClick={handleButtonSignIn}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        }
        errors={errors}
        requestError={requestError}
      />
    </div>
  );
};
