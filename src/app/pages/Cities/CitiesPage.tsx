import Text from '@shared/components/Text';
import { Search } from '@shared/components/Search';
import { Pagination } from '@shared/components/Pagination';
import MultiDropdown from '@shared/components/MultiDropdown';
import { FC, useEffect } from 'react';
import Button from '@shared/components/Button';
import s from './CitiesPage.module.scss';
import { useWindowWidth } from '@shared/hooks';
import cn from 'classnames';
import { Slider } from '@shared/components/Slider';
import { ListCity } from '@shared/components/ListCity';
import { Range } from '@shared/types/slider';
import { observer } from 'mobx-react-lite';
import { citiesStore } from '@shared/stores';

const CitiesPageHeader: FC = () => (
  <section className={s.page__description}>
    <Text tag={'h2'} view={'title'} color={'primary'}>
      Citypedia
    </Text>
    <Text tag={'p'} view={'p-20'} color={'secondary'}>
      Explore major cities around the world and discover key information about each one. Find out their population,
      capital status, and the country they belong to — all in one place.
    </Text>
  </section>
);

const CitiesPageActions: FC = observer(() => {
  const { loadDropdownOptions, totalCities, paginatedCities } = citiesStore;

  useEffect(() => {
    (async () => await loadDropdownOptions())();
  }, [loadDropdownOptions]);

  return (
    <div className={s.page__toolbar}>
      <div className={s['page__toolbar-container']}>
        <Search actionName={'Find now'} placeholder={'Search City'} />
        <MultiDropdown className={s.page__dropdown} />
        <Slider min={3} max={Math.min(totalCities, 10) as Range<4, 10>} />
      </div>
      <div className={s.page__counter}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Total Cities
        </Text>
        {paginatedCities.length && (
          <Text tag={'p'} view={'p-20'} color={'accent'} weight={'bold'}>
            {paginatedCities.length}
          </Text>
        )}
      </div>
    </div>
  );
});

const CitiesPageList: FC = observer(() => {
  const windowWidth = useWindowWidth();
  const { paginatedCities, isLoading } = citiesStore;

  return (
    <ul className={cn(s.page__gallery, windowWidth <= 1440 && s.page__gallery_resize)}>
      {paginatedCities.map(({ id, ...city }) => (
        <ListCity currentCity={{ ...city, id }} action={<Button>Find ticket</Button>} isLoading={isLoading} key={id} />
      ))}
    </ul>
  );
});

export const CitiesPage: FC = observer(() => (
  <div className={s.page}>
    <CitiesPageHeader />
    <CitiesPageActions />
    <CitiesPageList />
    <Pagination className={s.page__pagination} />
  </div>
));
