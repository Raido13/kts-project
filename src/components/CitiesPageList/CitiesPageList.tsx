import { useRootStore } from '@shared/hooks';
import { FC } from 'react';
import { CitiesList } from '../CitiesList';
import { observer } from 'mobx-react-lite';

export const CitiesPageList: FC = observer(() => {
  const { citiesStore } = useRootStore();
  const { citiesDataStore, paginationStore, isLoading } = citiesStore;
  const { paginatedCities } = citiesDataStore;
  const { viewPerPage } = paginationStore;

  return <CitiesList loadingCities={viewPerPage} isLoading={isLoading} cities={paginatedCities} />;
});
