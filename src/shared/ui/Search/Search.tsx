import { HTMLAttributes, useState } from 'react';
import Input from '../Input';
import Button from '../Button';
import s from './Search.module.scss';
import cn from 'classnames';

interface SearchProps extends HTMLAttributes<HTMLDivElement> {
  /** Текст на кнопке */
  initialQuery?: string;
  /** Функция фильтрации массива */
  onSearchFilter: (value: string) => void;
  /** Текст на кнопке */
  actionName: string;
  /** Текст в placeholder */
  placeholder: string;
  /** Дополнительный classname */
  className?: string;
}

export const Search: React.FC<SearchProps> = ({ initialQuery, onSearchFilter, actionName, placeholder, className }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState<string>(initialQuery ?? '');

  const handleClearSearch = () => {
    onSearchFilter('');
    setLocalSearchQuery('');
  };

  return (
    <div className={cn(s.search, className)}>
      <Input
        value={localSearchQuery}
        onChange={setLocalSearchQuery}
        onKeyDown={(e) => e.key === 'Enter' && onSearchFilter(localSearchQuery)}
        placeholder={placeholder}
        className={s.search__input}
      />
      <Button onClick={() => onSearchFilter(localSearchQuery)}>{actionName}</Button>
      <Button className={s.search__button} onClick={handleClearSearch}>
        {'Clear Search'}
      </Button>
    </div>
  );
};
