import { HTMLAttributes, useState } from 'react';
import Input from '../Input';
import Button from '../Button';
import s from './Search.module.scss';
import cn from 'classnames';
import { City } from '@shared/lib/types/city';

interface SearchProps extends HTMLAttributes<HTMLDivElement> {
  /** Массив городов */
  initialCities: City[];
  /** Функция фильтрации массива */
  onFilterChange: (filteredCities: City[]) => void;
  /** Текст на кнопке */
  actionName: string;
  /** Текст в placeholder */
  placeholder: string;
  /** Дополнительный classname */
  className?: string;
}

export const Search: React.FC<SearchProps> = ({
  initialCities,
  onFilterChange,
  actionName,
  placeholder,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const filteredCities = initialCities.filter((city) =>
      city.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
    );

    onFilterChange(filteredCities);
  };

  return (
    <div className={cn(s.search, className)}>
      <Input
        value={searchQuery}
        onChange={setSearchQuery}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder={placeholder}
        className={s.search__input}
      />
      <Button onClick={handleSearch}>{actionName}</Button>
    </div>
  );
};
