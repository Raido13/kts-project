import { HTMLAttributes, useState } from 'react';
import Input from '@shared/components/Input';
import Button from '@shared/components/Button';
import s from './Search.module.scss';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { citiesStore } from '@shared/stores';

interface SearchProps extends HTMLAttributes<HTMLDivElement> {
  /** Коллбек после поиска */
  onSearchFilter?: (value: string) => void;
  /** Текст на кнопке */
  actionName: string;
  /** Текст в placeholder */
  placeholder: string;
  /** Дополнительный classname */
  className?: string;
}

export const Search: React.FC<SearchProps> = observer(({ onSearchFilter, actionName, placeholder, className }) => {
  const { setSearchQuery, searchQuery } = citiesStore;
  const [localSearchQuery, setLocalSearchQuery] = useState<string>(searchQuery);

  const handleClearSearch = () => {
    onSearchFilter?.(searchQuery);
    setSearchQuery('');
    setLocalSearchQuery('');
  };

  return (
    <div className={cn(s.search, className)}>
      <Input
        value={localSearchQuery}
        onChange={setLocalSearchQuery}
        onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(localSearchQuery)}
        placeholder={placeholder}
        className={s.search__input}
      />
      <Button className={s.search__button} onClick={() => setSearchQuery(localSearchQuery)}>
        {actionName}
      </Button>
      <Button className={cn(s.search__button, s[`search__button-second`])} onClick={handleClearSearch}>
        {'Clear Search'}
      </Button>
    </div>
  );
});
