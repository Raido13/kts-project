import { FC, HTMLAttributes, ReactNode } from 'react';
import { Field } from '../Field';
import { FieldType } from '@shared/lib/types/field';
import s from './Form.module.scss';

interface FormProps extends HTMLAttributes<HTMLFormElement> {
  formState: Record<string, string | boolean>;
  handleCheckboxChange: (name: string) => (checked: boolean) => void;
  handleTextChange: (name: string) => (value: string) => void;
  fields: FieldType[];
  actionButton: ReactNode;
}

export const Form: FC<FormProps> = ({ formState, handleCheckboxChange, handleTextChange, fields, actionButton }) => (
  <form className={s.form} onSubmit={(e) => e.preventDefault()}>
    {fields.map(({ name, type, ...field }) =>
      type === 'checkbox' ? (
        <Field
          key={name}
          name={name}
          {...field}
          value={formState[name] as boolean}
          type="checkbox"
          onChange={handleCheckboxChange(name)}
        />
      ) : (
        <Field
          key={name}
          name={name}
          {...field}
          value={formState[name] as string}
          type={type}
          onChange={handleTextChange(name)}
        />
      )
    )}
    <div className={s.form__action}>{actionButton}</div>
  </form>
);
