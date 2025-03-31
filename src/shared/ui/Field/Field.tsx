import { FC, HTMLAttributes } from 'react';
import s from './Field.module.scss';
import Text from '@shared/ui/Text';
import Input from '@shared/ui/Input';
import CheckBox from '@shared/ui/CheckBox';

interface CommonFieldProps extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  name: string;
}

interface TextFieldProps extends CommonFieldProps {
  type: 'text' | 'email' | 'number' | 'password';
  value: string;
  onChange: (value: string) => void;
}

interface CheckboxFieldProps extends CommonFieldProps {
  type: 'checkbox';
  value: boolean;
  onChange: (checked: boolean) => void;
}

type FieldProps = TextFieldProps | CheckboxFieldProps;

export const Field: FC<FieldProps> = ({ label, type, value, onChange, ...props }) => (
  <div className={s.field}>
    <Text view={'p-14'}>{label}</Text>
    {type === 'checkbox' ? (
      <CheckBox type={type} checked={value} onChange={onChange} {...props} />
    ) : (
      <Input type={type} value={value} onChange={onChange} {...props} />
    )}
  </div>
);
