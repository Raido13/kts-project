import React, { useEffect, useRef, useState } from 'react';
import Input from '@shared/components/Input';
import Text from '@shared/components/Text';
import ArrowDownIcon from '@shared/components/Icon/ArrowDownIcon';
import s from './MultiDropdown.module.scss';
import cn from 'classnames';
import { Option } from '@shared/types/options';
import { observer } from 'mobx-react-lite';
import { untracked } from 'mobx';
import { useRootStore } from '@shared/hooks';

/** Пропсы, которые принимает компонент Dropdown */
export type MultiDropdownProps = {
  className?: string;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;
};

const MultiDropdown: React.FC<MultiDropdownProps> = observer(({ disabled, className }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const rootStore = useRootStore();
  const { setDropdownValue } = rootStore.filterStore;
  const dropdownOptions = rootStore.filterStore.dropdownOptions;
  const dropdownTitle = rootStore.filterStore.dropdownTitle;
  const dropdownValue = rootStore.filterStore.dropdownValue;

  const filteredOptions = Array.from(
    new Map(
      dropdownOptions
        .filter((option) => option.value.toLowerCase().includes(localSearchQuery.toLowerCase()))
        .map((option) => [option.value.toLowerCase(), option])
    ).values()
  );

  const checkSelect = (option: Option) => dropdownValue.some((v) => v.key === option.key);

  const handleClickOption = (isSelected: boolean, key: string, value: string) => {
    if (isSelected) {
      const updatedValues = dropdownValue.filter((v) => v.key !== key);
      setDropdownValue([...updatedValues]);
    } else {
      setDropdownValue([...dropdownValue, { key, value }]);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  const onContainerClick = () => {
    inputRef.current?.focus();
    setIsOpen(true);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) setLocalSearchQuery('');
  }, [isOpen]);

  const inputValue = isOpen
    ? localSearchQuery
    : localSearchQuery !== ''
      ? localSearchQuery
      : dropdownValue.length > 0
        ? dropdownTitle
        : '';

  return (
    <div className={cn(s.dropdown, className)} ref={dropdownRef} onClick={onContainerClick}>
      <Input
        value={inputValue}
        placeholder={dropdownTitle}
        onChange={(value) => {
          setLocalSearchQuery(value);
        }}
        afterSlot={<ArrowDownIcon color="secondary" className={s.dropdown__icon} />}
        className={s.dropdown__field}
        ref={inputRef}
      />
      {!disabled && dropdownOptions.length > 0 && isOpen && (
        <ul className={cn(s.dropdown__list, s.dropdown__list_opened)}>
          {filteredOptions.map((option) => {
            const { key, value } = option;
            const isSelected = checkSelect(option);
            const isHovered = hoveredKey === option.key;
            const color = isSelected ? 'accent' : isHovered ? 'secondary' : 'primary';

            return (
              <li
                className={s.dropdown__item}
                onClick={() => handleClickOption(isSelected, key, value)}
                onMouseEnter={() => {
                  untracked(() => {
                    setHoveredKey(key);
                  });
                }}
                onMouseLeave={() => {
                  untracked(() => {
                    setHoveredKey(null);
                  });
                }}
                key={key}
              >
                <Text view={'p-16'} tag={'p'} color={color}>
                  {value}
                </Text>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});

export default MultiDropdown;
