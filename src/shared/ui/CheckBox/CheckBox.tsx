import React from 'react';
import CheckIcon from '../Icon/CheckIcon';
import s from './CheckBox.module.scss';
import cn from 'classnames';

export type CheckBoxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  /** Вызывается при клике на чекбокс */
  onChange: (checked: boolean) => void;
};

const CheckBox: React.FC<CheckBoxProps> = ({ checked, onChange, disabled, className, ...props }) => (
  <label className={cn(s.checkbox, className)}>
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      className={s.checkbox__input}
      {...props}
    />
    <span className={cn(s.checkbox__box, disabled && s.checkbox__box_disabled)}>
      {checked && (
        <CheckIcon
          width={40}
          height={40}
          color={'accent'}
          className={cn(s.checkbox__icon, disabled && s.checkbox__icon_disabled)}
        />
      )}
    </span>
  </label>
);

export default CheckBox;
