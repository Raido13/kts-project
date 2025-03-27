import { Dispatch, HTMLAttributes, SetStateAction } from 'react';
import Input from '../Input';
import Button from '../Button';
import s from './Search.module.scss';
import cn from 'classnames';

interface SearchProps extends HTMLAttributes<HTMLDivElement> {
  /** Функция фильтрации массива */
  onSearchFilter: () => void;
  /** Метод передачи параметров поиска */
  setSearchQuery: Dispatch<SetStateAction<string>>;
  /** Параметры поиска */
  searchQuery: string;
  /** Текст на кнопке */
  actionName: string;
  /** Текст в placeholder */
  placeholder: string;
  /** Дополнительный classname */
  className?: string;
}

export const Search: React.FC<SearchProps> = ({
  onSearchFilter,
  setSearchQuery,
  searchQuery,
  actionName,
  placeholder,
  className,
}) => (
  <div className={cn(s.search, className)}>
    <Input
      value={searchQuery}
      onChange={setSearchQuery}
      onKeyDown={(e) => e.key === 'Enter' && onSearchFilter()}
      placeholder={placeholder}
      className={s.search__input}
    />
    <Button onClick={() => onSearchFilter()}>{actionName}</Button>
  </div>
);
