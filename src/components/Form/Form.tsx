import { FC, HTMLAttributes, ReactNode } from 'react';
import { Field } from '@shared/components/Field';
import { FieldType } from '@shared/types/field';
import s from './Form.module.scss';
import Text from '@shared/components/Text';

interface FormProps extends HTMLAttributes<HTMLFormElement> {
  formState: Record<string, string | boolean>;
  handleCheckboxChange: (name: string) => (checked: boolean) => void;
  handleTextChange: (name: string) => (value: string) => void;
  fields: FieldType[];
  actionButton: ReactNode;
  errors: Record<string, string | null>;
  requestError: string | null;
}

export const Form: FC<FormProps> = ({
  formState,
  handleCheckboxChange,
  handleTextChange,
  fields,
  actionButton,
  errors,
  requestError,
}) => (
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
          errors={errors}
        />
      ) : (
        <Field
          key={name}
          name={name}
          {...field}
          value={formState[name] as string}
          type={type}
          onChange={handleTextChange(name)}
          errors={errors}
        />
      )
    )}
    {requestError && (
      <Text view={'p-20'} className={s.form__error}>
        {requestError}
      </Text>
    )}
    <div className={s.form__action}>{actionButton}</div>
  </form>
);
