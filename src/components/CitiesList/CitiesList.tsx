import { FC } from 'react';
import { ListCity } from '@shared/components/ListCity';
import Button from '@shared/components/Button';
import { CityType } from '@shared/types/city';
import { observer } from 'mobx-react-lite';
import cn from 'classnames';
import { useWindowWidth } from '@shared/hooks';
import s from './CitiesList.module.scss';

interface CitiesListProps {
  loadingCities: number;
  cities: CityType[];
  isLoading: boolean;
}

export const CitiesList: FC<CitiesListProps> = observer(({ loadingCities, cities, isLoading }) => {
  const windowWidth = useWindowWidth();
  return (
    <ul className={cn(s.gallery, windowWidth <= 1440 && s.gallery_resize)}>
      {isLoading
        ? Array(loadingCities)
            .fill(null)
            .map((_, idx) => <ListCity key={idx} action={<Button skeletonLoading={true}>Find ticket</Button>} />)
        : cities.map((city) => <ListCity city={city} action={<Button>Find ticket</Button>} key={city.id} />)}
    </ul>
  );
});
