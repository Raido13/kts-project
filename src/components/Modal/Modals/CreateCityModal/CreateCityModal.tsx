import { HTMLAttributes, FC, MouseEvent, useCallback, useEffect } from 'react';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import s from './CreateCityModal.module.scss';
import { useCitiesContext, useForm, useModalContext } from '@shared/hooks';
import { removeExtraEventActions } from '@shared/utils/utils';
import { FieldType } from '@shared/types/field';
import { Form } from '@shared/components/Form';
import { useRequestError } from '@shared/hooks/useRequestError';
import { createCity } from '@shared/services/cities/createCity';
import { CityType } from '@shared/types/city';

export const CreateCityModal: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const { fetchWithRetry } = useCitiesContext();
  const { closeModal } = useModalContext();
  const { requestError, setRequestError, clearError } = useRequestError();

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

  const { formState, handleCheckboxChange, handleTextChange, validate, errors, isSubmitting, setIsSubmitting } =
    useForm(fieldSet);

  const handleCreateCity = useCallback(async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    const newCity = {
      ...formState,
      likes: [] as string[],
    } as CityType;

    const creatingCity = await createCity(newCity);

    if (typeof creatingCity === 'string') {
      setRequestError(creatingCity);
      setIsSubmitting(false);
      return;
    }

    fetchWithRetry();

    setIsSubmitting(false);
    clearError();
    closeModal();
  }, [formState, closeModal, setIsSubmitting, setRequestError, clearError, validate, fetchWithRetry]);

  const handleButtonCreateCity = (e: MouseEvent<HTMLButtonElement>) => {
    removeExtraEventActions(e);
    handleCreateCity();
  };

  const handleEnterDownCreateCity = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || isSubmitting) return;
      handleCreateCity();
    },
    [handleCreateCity, isSubmitting]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleEnterDownCreateCity);
    return () => window.removeEventListener('keydown', handleEnterDownCreateCity);
  }, [handleEnterDownCreateCity]);

  return (
    <div className={s.modal}>
      <Text view={'title'} weight={'bold'} tag={'p'}>
        Create City
      </Text>
      <Form
        fields={fieldSet}
        formState={formState}
        handleTextChange={handleTextChange}
        handleCheckboxChange={handleCheckboxChange}
        actionButton={
          <Button disabled={isSubmitting} onClick={handleButtonCreateCity}>
            {isSubmitting ? 'Creating' : 'Create'}
          </Button>
        }
        errors={errors}
        requestError={requestError}
      />
    </div>
  );
};
