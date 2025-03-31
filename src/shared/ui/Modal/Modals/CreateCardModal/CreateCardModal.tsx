import { HTMLAttributes, FC, MouseEvent, useCallback, useEffect } from 'react';
import Text from '@shared/ui/Text';
import Button from '@shared/ui/Button';
import s from './CreateCardModal.module.scss';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@shared/lib/config/firebase';
import { useForm, useModalContext } from '@shared/lib/hooks';
import { COLLECTION } from '@shared/lib/constants/constants';
import { removeExtraEventActions } from '@shared/lib/utils/utils';
import { FieldType } from '@shared/lib/types/field';
import { Form } from '@shared/ui/Form';

export const CreateCardModal: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const { closeModal } = useModalContext();

  const fieldSet: FieldType[] = [
    {
      name: 'name',
      label: 'Enter city name',
      type: 'text',
      value: '',
      onChange: () => {},
    },
    {
      name: 'country',
      label: 'Enter city country',
      type: 'text',
      value: '',
      onChange: () => {},
    },
    {
      name: 'population',
      label: 'Enter population',
      type: 'text',
      value: '',
      onChange: () => {},
    },
    {
      name: 'image',
      label: 'Enter image',
      type: 'text',
      value: '',
      onChange: () => {},
    },
    {
      name: 'is_capital',
      label: 'Is it Capital',
      type: 'checkbox',
      value: false,
      onChange: () => {},
    },
  ];

  const { formState, handleCheckboxChange, handleTextChange } = useForm(fieldSet);

  const handleCreateCard = useCallback(async () => {
    await addDoc(collection(db, COLLECTION), { ...formState, likes: 0 });
    closeModal();
  }, [formState, closeModal]);

  const handleButtonCreateCard = (e: MouseEvent<HTMLButtonElement>) => {
    removeExtraEventActions(e);
    handleCreateCard();
  };

  const handleEnterDownCreateCard = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      handleCreateCard();
    },
    [handleCreateCard]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleEnterDownCreateCard);
    return () => window.removeEventListener('keydown', handleEnterDownCreateCard);
  }, [handleEnterDownCreateCard]);

  return (
    <div className={s.modal}>
      <Text view={'title'} weight={'bold'} tag={'p'}>
        Create City card
      </Text>
      <Form
        fields={fieldSet}
        formState={formState}
        handleTextChange={handleTextChange}
        handleCheckboxChange={handleCheckboxChange}
        actionButton={<Button onClick={handleButtonCreateCard}>Create</Button>}
      />
    </div>
  );
};
