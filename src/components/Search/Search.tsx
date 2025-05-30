import { HTMLAttributes, useEffect, useState } from 'react';
import Input from '@shared/components/Input';
import Button from '@shared/components/Button';
import s from './Search.module.scss';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { useRootStore } from '@shared/hooks';

interface SearchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Коллбек после поиска */
  onSearchFilter?: (value: string) => void;
  /** Текст на кнопке */
  actionName: string;
  /** Текст в placeholder */
  placeholder: string;
  /** Дополнительный classname */
  className?: string;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;
}

export const Search: React.FC<SearchProps> = observer(
  ({ onSearchFilter, actionName, placeholder, className, ...props }) => {
    const [localSearchQuery, setLocalSearchQuery] = useState<string>('');
    const rootStore = useRootStore();
    const { setSearchQuery } = rootStore.filterStore;
    const searchQuery = rootStore.filterStore.searchQuery;

    const handleClearSearch = () => {
      onSearchFilter?.('');
      setSearchQuery('');
      setLocalSearchQuery('');
    };

    const handleSetSearch = () => {
      runInAction(() => {
        setSearchQuery(localSearchQuery);
      });
      onSearchFilter?.(localSearchQuery);
    };

    useEffect(() => {
      setLocalSearchQuery(searchQuery);
    }, [searchQuery]);

    return (
      <div className={cn(s.search, className)}>
        <Input
          value={localSearchQuery}
          onChange={setLocalSearchQuery}
          onKeyDown={(e) => e.key === 'Enter' && handleSetSearch()}
          placeholder={placeholder}
          className={s.search__input}
          {...props}
        />
        <Button className={s.search__button} onClick={() => handleSetSearch()}>
          {actionName}
        </Button>
        <Button className={cn(s.search__button, s[`search__button-second`])} onClick={handleClearSearch}>
          {'Clear Search'}
        </Button>
      </div>
    );
  }
);
