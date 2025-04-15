import { useRootStore } from '@shared/hooks';
import { FC } from 'react';
import { ListContainer } from '@shared/components/ListContainer';
import { observer } from 'mobx-react-lite';

export const PageList: FC = observer(() => {
  const { citiesStore, citiesDataStore, paginationStore } = useRootStore();
  const { isLoading } = citiesStore;
  const { paginatedCities } = citiesDataStore;
  const { viewPerPage } = paginationStore;

  return <ListContainer loadingItems={viewPerPage} isLoading={isLoading} items={paginatedCities} />;
});
