import React, { useEffect, useRef, useState } from 'react';
import Input from '@shared/components/Input';
import Text from '@shared/components/Text';
import ArrowDownIcon from '@shared/components/Icon/ArrowDownIcon';
import s from './MultiDropdown.module.scss';
import cn from 'classnames';
import { Option } from '@shared/types/options';
import { observer } from 'mobx-react-lite';
import { citiesStore } from '@shared/stores';

/** Пропсы, которые принимает компонент Dropdown */
export type MultiDropdownProps = {
  className?: string;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;
};

const MultiDropdown: React.FC<MultiDropdownProps> = observer(({ disabled, className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { dropdownValue, dropdownOptions, setDropdownValue, getDropdownTitle } = citiesStore;

  const filteredOptions = Array.from(
    new Map(
      dropdownOptions
        .filter((option) => option.value.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((option) => [option.value.toLowerCase(), option])
    ).values()
  );

  const checkSelect = (option: Option) => dropdownValue.some((v) => v.key === option.key);

  const handleSelect = (option: Option) => {
    setDropdownValue([...dropdownValue, option]);
    setSearchQuery('');
  };

  const handleRemove = ({ key }: Option) => {
    const updatedValues = dropdownValue.filter((v) => v.key !== key);
    setDropdownValue([...updatedValues]);
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
    if (!isOpen) setSearchQuery('');
  }, [isOpen]);

  const inputValue = isOpen
    ? searchQuery
    : searchQuery !== ''
      ? searchQuery
      : dropdownValue.length > 0
        ? getDropdownTitle()
        : '';

  return (
    <div className={cn(s.dropdown, className)} ref={dropdownRef}>
      <Input
        value={inputValue}
        placeholder={getDropdownTitle()}
        onChange={(value) => {
          setSearchQuery(value);
        }}
        afterSlot={<ArrowDownIcon color="secondary" />}
        onClick={() => setIsOpen(true)}
      />
      {!disabled && dropdownOptions.length > 0 && isOpen && (
        <ul className={cn(s.dropdown__list, s.dropdown__list_opened)}>
          {filteredOptions.map((option) => {
            const isSelected = checkSelect(option);
            const isHovered = hoveredKey === option.key;
            const color = isSelected ? 'accent' : isHovered ? 'secondary' : 'primary';

            return (
              <li
                {...option}
                className={s.dropdown__item}
                onClick={() => (isSelected ? handleRemove(option) : handleSelect(option))}
                onMouseEnter={() => setHoveredKey(option.key)}
                onMouseLeave={() => setHoveredKey(null)}
                key={option.key}
              >
                <Text view={'p-16'} tag={'p'} color={color}>
                  {option.value}
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
