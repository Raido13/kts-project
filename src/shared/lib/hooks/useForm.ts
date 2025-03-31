import { useState } from 'react';
import { FieldType } from '../types/field';

export const useForm = (fields: FieldType[]) => {
  const initialState = fields.reduce(
    (state, field) => ({
      ...state,
      [field.name]: field.value,
    }),
    {} as Record<string, string | boolean>
  );
  const [formState, setFormState] = useState(initialState);

  const handleTextChange = (name: string) => (value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setFormState((prev) => ({ ...prev, [name]: checked }));
  };

  return {
    formState,
    handleCheckboxChange,
    handleTextChange,
  };
};
