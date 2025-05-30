import { useState } from 'react';
import { FieldType } from '@shared/types/field';

export const useForm = (fields: FieldType[]) => {
  const initialState = fields.reduce(
    (state, field) => ({
      ...state,
      [field.name]: field.value,
    }),
    {} as Record<string, string | boolean>
  );
  const [formState, setFormState] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validate = () => {
    const newErrors: Record<string, string | null> = {};

    fields.forEach(({ name, ...field }) => {
      const value = formState[name];
      newErrors[name] = field.validate ? field.validate(value) : null;
    });

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === null);
  };

  const handleTextChange = (name: string) => (value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setFormState((prev) => ({ ...prev, [name]: checked }));
  };

  const handleClearForm = () => {
    setFormState(initialState);
  };

  return {
    formState,
    handleCheckboxChange,
    handleTextChange,
    handleClearForm,
    validate,
    errors,
    isSubmitting,
    setIsSubmitting,
  };
};
