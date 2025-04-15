import { useForm, useRequestError, useRootStore } from '@shared/hooks';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import { Form } from '@shared/components/Form';
import { FieldType } from '@shared/types/field';
import { useCallback, useMemo, MouseEvent, useEffect } from 'react';
import { removeExtraEventActions } from '@shared/utils/utils';
import s from './CommentsModal.module.scss';
import { CityComment } from '@shared/types/city';
import cn from 'classnames';
import { Timestamp } from 'firebase/firestore';
import { observer } from 'mobx-react-lite';

export const CommentsModal = observer(() => {
  const { citiesDataStore, citiesStore, toastStore, userStore } = useRootStore();
  const { addComment } = citiesStore;
  const { currentCity, citiesComments } = citiesDataStore;
  const { user } = userStore;
  const { showToast } = toastStore;
  const { requestError, setRequestError, clearError } = useRequestError();

  const fieldSet: FieldType[] = useMemo(
    () => [
      {
        name: 'message',
        label: 'Enter Message',
        type: 'text',
        value: '',
        onChange: () => {},
        validate: (value) => {
          if (!value) return 'Message is required';
          return null;
        },
      },
    ],
    []
  );

  const {
    formState,
    handleCheckboxChange,
    handleTextChange,
    handleClearForm,
    validate,
    errors,
    isSubmitting,
    setIsSubmitting,
  } = useForm(fieldSet);

  const handleAddComment = useCallback(async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    const message = formState.message as string;
    const addingComment = await addComment(currentCity!.id, user!.uid, message);

    if (typeof addingComment === 'string') {
      setRequestError(addingComment);
      setIsSubmitting(false);
      return;
    }

    handleClearForm();
    setIsSubmitting(false);
    clearError();
    showToast('Comment successfully added!', 'success');
  }, [
    addComment,
    clearError,
    currentCity,
    formState,
    setIsSubmitting,
    setRequestError,
    handleClearForm,
    showToast,
    user,
    validate,
  ]);

  const handleButtonAddComment = (e: MouseEvent<HTMLButtonElement>) => {
    removeExtraEventActions(e);
    handleAddComment();
  };

  const handleEnterDownAddComment = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || isSubmitting) return;
      handleAddComment();
    },
    [handleAddComment, isSubmitting]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleEnterDownAddComment);
    return () => window.removeEventListener('keydown', handleEnterDownAddComment);
  }, [handleEnterDownAddComment]);

  const cityComments = currentCity?.id ? Object.values(citiesComments[currentCity.id] || {}).flat() : [];

  return (
    <div className={s.modal}>
      <Text view={'title'} weight={'bold'} tag={'p'} className={s.modal__text}>
        City Comments
      </Text>
      {cityComments.length !== 0 && (
        <div className={s.modal__chat}>
          {(cityComments as CityComment[]).map(({ date, message, owner }, idx) => {
            const isOwner = owner === user!.uid;
            return (
              <div className={cn(s.modal__message)} key={idx}>
                <Text
                  view={'p-18'}
                  tag={'p'}
                  color={isOwner ? 'accent' : 'primary'}
                  className={cn(isOwner && s[`modal__message-text_owner`])}
                >
                  {message}
                </Text>
                <Text
                  view={'p-14'}
                  tag={'p'}
                  color={'secondary'}
                  className={cn(isOwner && s[`modal__message-text_owner`])}
                >
                  {(date instanceof Timestamp ? date.toDate() : new Date(date))
                    .toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    })
                    .replace(',', ' at')}
                </Text>
              </div>
            );
          })}
        </div>
      )}
      <Form
        fields={fieldSet}
        formState={formState}
        handleTextChange={handleTextChange}
        handleCheckboxChange={handleCheckboxChange}
        actionButton={
          <Button disabled={isSubmitting} onClick={handleButtonAddComment}>
            {isSubmitting ? 'Adding...' : 'Add'}
          </Button>
        }
        errors={errors}
        requestError={requestError}
      />
    </div>
  );
});
