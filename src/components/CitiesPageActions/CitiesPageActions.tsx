import { useRootStore } from '@shared/hooks';
import { observer } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import { Search } from '../Search';
import MultiDropdown from '../MultiDropdown';
import { Slider } from '../Slider';
import Text from '@shared/components/Text';
import s from './CitiesPageActions.module.scss';
import { Range } from '@shared/types/slider';

export const CitiesPageActions: FC = observer(() => {
  const { citiesStore } = useRootStore();
  const { filterStore } = citiesStore;

  useEffect(() => {
    if (filterStore.dropdownOptions.length === 0) {
      filterStore.loadDropdownOptions();
    }
  }, [filterStore]);

  return (
    <div className={s.toolbar}>
      <div className={s['toolbar-container']}>
        <Search actionName={'Find now'} placeholder={'Search City'} disabled={citiesStore.isLoading} />
        <MultiDropdown className={s.dropdown} />
        <Slider min={3} max={Math.min(citiesStore.paginationStore.totalPaginatedCities, 10) as Range<4, 10>} />
      </div>
      <div className={s.counter}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Total Cities
        </Text>
        {citiesStore.citiesDataStore.paginatedCities.length > 0 && (
          <Text tag={'p'} view={'p-20'} color={'accent'} weight={'bold'}>
            {citiesStore.citiesDataStore.paginatedCities.length}
          </Text>
        )}
      </div>
    </div>
  );
});
