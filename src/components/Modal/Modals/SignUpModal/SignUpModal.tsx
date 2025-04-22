import { HTMLAttributes, FC, MouseEvent, useEffect, useCallback, useMemo } from 'react';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import s from './SignUpModal.module.scss';
import { useForm, useRootStore } from '@shared/hooks';
import { removeExtraEventActions } from '@shared/utils/utils';
import { FieldType } from '@shared/types/field';
import { Form } from '@shared/components/Form';
import { useRequestError } from '@shared/hooks';
import { observer } from 'mobx-react-lite';

export const SignUpModal: FC<HTMLAttributes<HTMLDivElement>> = observer(() => {
  const rootStore = useRootStore();
  const {
    modalStore: { closeModal },
    userStore: { register },
    toastStore: { showToast },
  } = rootStore;
  const { requestError, setRequestError, clearError } = useRequestError();

  const fieldSet: FieldType[] = useMemo(
    () => [
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
    ],
    []
  );

  const { formState, handleCheckboxChange, handleTextChange, validate, errors, isSubmitting, setIsSubmitting } =
    useForm(fieldSet);

  const handleSignUp = useCallback(async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    const email = formState.email as string;
    const password = formState.password as string;
    const userCredential = await register(email, password);

    if (typeof userCredential === 'string') {
      setIsSubmitting(false);
      setRequestError(userCredential);
      return;
    }

    setIsSubmitting(false);
    clearError();
    showToast('Successfully Register!', 'success');
    closeModal();
  }, [
    formState.email,
    formState.password,
    closeModal,
    validate,
    clearError,
    setRequestError,
    setIsSubmitting,
    register,
    showToast,
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
});
