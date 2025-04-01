import { HTMLAttributes, FC, MouseEvent, useCallback, useEffect } from 'react';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import s from './CreateCardModal.module.scss';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@shared/config/firebase';
import { useForm, useModalContext } from '@shared/hooks';
import { COLLECTION } from '@shared/constants/constants';
import { removeExtraEventActions } from '@shared/utils/utils';
import { FieldType } from '@shared/types/field';
import { Form } from '@shared/components/Form';

export const CreateCardModal: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const { closeModal } = useModalContext();

  const fieldSet: FieldType[] = [
    {
      name: 'name',
      label: 'Enter city name',
      type: 'text',
      value: '',
      onChange: () => {},
      validate: (value) => {
        if (!value) return 'Name is required';
        return null;
      },
    },
    {
      name: 'country',
      label: 'Enter city country',
      type: 'text',
      value: '',
      onChange: () => {},
      validate: (value) => {
        if (!value) return 'Country is required';
        return null;
      },
    },
    {
      name: 'population',
      label: 'Enter population',
      type: 'text',
      value: '',
      onChange: () => {},
      validate: (value) => {
        if (!value) return 'Population is required';
        if (!/^\d+$/.test(value as string)) return 'Population must be a valid number';
        return null;
      },
    },
    {
      name: 'image',
      label: 'Enter image',
      type: 'text',
      value: '',
      onChange: () => {},
      validate: (value) => {
        const url = value as string;
        if (!url) return 'Image URL is required';
        try {
          new URL(url);
        } catch {
          return 'Invalid URL format';
        }
        if (!/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)) {
          return 'URL must point to an image';
        }
        return null;
      },
    },
    {
      name: 'is_capital',
      label: 'Is it Capital',
      type: 'checkbox',
      value: false,
      onChange: () => {},
    },
  ];

  const { formState, handleCheckboxChange, handleTextChange, validate, errors } = useForm(fieldSet);

  const handleCreateCard = useCallback(async () => {
    if (!validate()) return;
    await addDoc(collection(db, COLLECTION), { ...formState, likes: 0 });
    closeModal();
  }, [formState, closeModal, validate]);

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
        errors={errors}
      />
    </div>
  );
};
