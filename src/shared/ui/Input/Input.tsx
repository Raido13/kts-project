import React, { useRef, useState } from 'react';
import s from './Input.module.scss';
import cn from 'classnames';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  /** Значение поля */
  value: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange: (value: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
  /** Дополнительный classname */
  className?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ onChange, afterSlot, className, disabled, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <div
        className={cn(s.input, isFocused && s.input_focus, className)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={1}
      >
        <input
          onChange={handleChange}
          type="text"
          className={cn(s.input__field, disabled && s.input_disabled)}
          disabled={disabled}
          ref={ref ?? inputRef}
          {...props}
        />
        {afterSlot && <div className={s.input__icon}>{afterSlot}</div>}
      </div>
    );
  }
);

export default Input;
