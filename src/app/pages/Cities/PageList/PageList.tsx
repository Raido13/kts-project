import { useRootStore } from '@shared/hooks';
import { FC } from 'react';
import { ListContainer } from '@shared/components/ListContainer';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

export const PageList: FC = observer(() => {
  const rootStore = useRootStore();
  const isLoading = rootStore.citiesStore.isLoading;
  const paginatedCities = toJS(rootStore.citiesDataStore.paginatedCities);
  const viewPerPage = rootStore.paginationStore.viewPerPage;

  return <ListContainer loadingItems={viewPerPage} isLoading={isLoading} items={paginatedCities} />;
});
