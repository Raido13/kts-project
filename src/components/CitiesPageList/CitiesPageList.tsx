import { useRootStore } from '@shared/hooks';
import { FC } from 'react';
import { CitiesList } from '../CitiesList';
import { observer } from 'mobx-react-lite';

export const CitiesPageList: FC = observer(() => {
  const rootStoreContext = useRootStore();
  const { citiesDataStore, paginationStore, isLoading } = rootStoreContext.citiesStore;
  const { paginatedCities } = citiesDataStore;
  const { viewPerPage } = paginationStore;

  return <CitiesList loadingCities={viewPerPage} isLoading={isLoading} cities={paginatedCities} />;
});
