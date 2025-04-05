import React, { useEffect, useRef, useState } from 'react';
import Input from '@shared/components/Input';
import Text from '@shared/components/Text';
import ArrowDownIcon from '@shared/components/Icon/ArrowDownIcon';
import s from './MultiDropdown.module.scss';
import cn from 'classnames';
import { Option } from '@shared/types/options';
import { observer } from 'mobx-react-lite';
import { citiesStore } from '@shared/stores';
import { runInAction, untracked } from 'mobx';

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
  const { setDropdownValue } = citiesStore;

  const filteredOptions = Array.from(
    new Map(
      citiesStore.dropdownOptions
        .filter((option) => option.value.toLowerCase().includes(localSearchQuery.toLowerCase()))
        .map((option) => [option.value.toLowerCase(), option])
    ).values()
  );

  const checkSelect = (option: Option) => citiesStore.dropdownValue.some((v) => v.key === option.key);

  const handleClick = (isSelected: boolean, key: string, value: string) => {
    runInAction(() => {
      if (isSelected) {
        const updatedValues = citiesStore.dropdownValue.filter((v) => v.key !== key);
        setDropdownValue([...updatedValues]);
      } else {
        setDropdownValue([...citiesStore.dropdownValue, { key, value }]);
      }
    });
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
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
      : citiesStore.dropdownValue.length > 0
        ? citiesStore.dropdownTitle
        : '';

  return (
    <div className={cn(s.dropdown, className)} ref={dropdownRef}>
      <Input
        value={inputValue}
        placeholder={citiesStore.dropdownTitle}
        onChange={(value) => {
          setLocalSearchQuery(value);
        }}
        afterSlot={<ArrowDownIcon color="secondary" />}
        onClick={() => setIsOpen(true)}
      />
      {!disabled && citiesStore.dropdownOptions.length > 0 && isOpen && (
        <ul className={cn(s.dropdown__list, s.dropdown__list_opened)}>
          {filteredOptions.map((option) => {
            const { key, value } = option;
            const isSelected = checkSelect(option);
            const isHovered = hoveredKey === option.key;
            const color = isSelected ? 'accent' : isHovered ? 'secondary' : 'primary';

            return (
              <li
                className={s.dropdown__item}
                onClick={() => handleClick(isSelected, key, value)}
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
