import { useRootStore } from '@shared/hooks';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { Search } from '@shared/components/Search';
import MultiDropdown from '@shared/components/MultiDropdown';
import { Slider } from '@shared/components/Slider';
import Text from '@shared/components/Text';
import s from './PageActions.module.scss';
import { Range } from '@shared/types/slider';

export const PageActions: FC = observer(() => {
  const rootStore = useRootStore();
  const isLoading = rootStore.citiesStore.isLoading;
  const total = rootStore.paginationStore.totalPaginatedCities;
  const cities = rootStore.citiesDataStore.paginatedCities;

  return (
    <div className={s.toolbar}>
      <div className={s['toolbar-container']}>
        <Search actionName={'Find now'} placeholder={'Search City'} disabled={isLoading} />
        <MultiDropdown className={s.dropdown} />
        <Slider min={3} max={Math.min(total, 10) as Range<4, 10>} />
      </div>
      <div className={s.counter}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Total Cities
        </Text>
        {cities.length > 0 && (
          <Text tag={'p'} view={'p-20'} color={'accent'} weight={'bold'}>
            {cities.length}
          </Text>
        )}
      </div>
    </div>
  );
});
