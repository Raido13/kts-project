import { HTMLAttributes, FC, MouseEvent, useCallback, useEffect, useMemo } from 'react';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import s from './SignInModal.module.scss';
import { useForm, useRootStore } from '@shared/hooks';
import { removeExtraEventActions } from '@shared/utils/utils';
import { Form } from '@shared/components/Form';
import { FieldType } from '@shared/types/field';
import { useRequestError } from '@shared/hooks';
import { observer } from 'mobx-react-lite';

export const SignInModal: FC<HTMLAttributes<HTMLDivElement>> = observer(() => {
  const rootStore = useRootStore();
  const {
    modalStore: { openModal, closeModal },
    userStore: { login },
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

  const handleSignIn = useCallback(async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    const email = formState.email as string;
    const password = formState.password as string;
    const userCredential = await login(email, password);

    if (typeof userCredential === 'string') {
      setRequestError(userCredential);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    clearError();
    showToast('Successfully Login!', 'success');
    closeModal();
  }, [
    formState.email,
    formState.password,
    closeModal,
    validate,
    clearError,
    setRequestError,
    setIsSubmitting,
    login,
    showToast,
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
});
