import { useRootStore } from '@shared/hooks';
import { observer } from 'mobx-react-lite';
import { FC, useEffect, useMemo } from 'react';
import { Search } from '../Search';
import MultiDropdown from '../MultiDropdown';
import { Slider } from '../Slider';
import Text from '@shared/components/Text';
import s from './CitiesPageActions.module.scss';
import { Range } from '@shared/types/slider';

export const CitiesPageActions: FC = observer(() => {
  const rootStoreContext = useRootStore();
  const { paginationStore, filterStore, isLoading } = rootStoreContext.citiesStore;
  const citiesDataStore = useMemo(
    () => rootStoreContext.citiesStore.citiesDataStore,
    [rootStoreContext.citiesStore.citiesDataStore]
  );
  const { paginatedCities } = citiesDataStore;
  const { totalPaginatedCities } = paginationStore;
  const { loadDropdownOptions, dropdownOptions } = filterStore;

  useEffect(() => {
    if (dropdownOptions.length === 0) {
      loadDropdownOptions();
    }
  }, [loadDropdownOptions, dropdownOptions.length]);

  return (
    <div className={s.toolbar}>
      <div className={s['toolbar-container']}>
        <Search actionName={'Find now'} placeholder={'Search City'} disabled={isLoading} />
        <MultiDropdown className={s.dropdown} />
        <Slider min={3} max={Math.min(totalPaginatedCities, 10) as Range<4, 10>} />
      </div>
      <div className={s.counter}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Total Cities
        </Text>
        {paginatedCities.length > 0 && (
          <Text tag={'p'} view={'p-20'} color={'accent'} weight={'bold'}>
            {paginatedCities.length}
          </Text>
        )}
      </div>
    </div>
  );
});
