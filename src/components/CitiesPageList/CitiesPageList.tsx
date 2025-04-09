import { useWindowWidth, useRootStore } from '@shared/hooks';
import { FC } from 'react';
import { CitiesList } from '../CitiesList';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import s from './CitiesPageList.module.scss';

export const CitiesPageList: FC = observer(() => {
  const windowWidth = useWindowWidth();
  const rootStoreContext = useRootStore();
  const { citiesDataStore, paginationStore, isLoading } = rootStoreContext.citiesStore;
  const { paginatedCities } = citiesDataStore;
  const { viewPerPage } = paginationStore;

  return (
    <ul className={cn(s.gallery, windowWidth <= 1440 && s.gallery_resize)}>
      <CitiesList loadingCities={viewPerPage} isLoading={isLoading} cities={paginatedCities} />
    </ul>
  );
});
