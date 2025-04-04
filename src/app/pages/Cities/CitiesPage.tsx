/* eslint-disable */
import Text from '@shared/components/Text';
import { Search } from '@shared/components/Search';
import { Pagination } from '@shared/components/Pagination';
import MultiDropdown from '@shared/components/MultiDropdown';
import { FC, useCallback, useEffect } from 'react';
import { Option } from '@shared/types/options';
import Button from '@shared/components/Button';
import s from './CitiesPage.module.scss';
import { useWindowWidth } from '@shared/hooks';
import cn from 'classnames';
import { useLocation } from 'react-router-dom';
import { Slider } from '@shared/components/Slider';
import { CityType } from '@shared/types/city';
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

interface CitiesPageActionsProps {
  preInitializedQuery?: string;
  onSearchFilter: (value: string) => void;
  dropdownOptions: Option[];
  dropdownValue: Option[];
  setDropdownValue: (value: Option[]) => void;
  getDropdownTitle: (value: Option[]) => string;
  viewPerPage: number;
  setViewPerPage: (value: number) => void;
  fetchedCities: CityType[];
  totalCities: number;
}

const CitiesPageActions: FC<CitiesPageActionsProps> = ({
  preInitializedQuery,
  onSearchFilter,
  viewPerPage,
  setViewPerPage,
  fetchedCities,
  totalCities,
}) => (
  <div className={s.page__toolbar}>
    <div className={s['page__toolbar-container']}>
      <Search
        initialQuery={preInitializedQuery}
        onSearchFilter={onSearchFilter}
        actionName={'Find now'}
        placeholder={'Search City'}
      />
      <MultiDropdown className={s.page__dropdown} />
      <Slider min={3} max={Math.min(totalCities, 10) as Range<4, 10>} value={viewPerPage} onChange={setViewPerPage} />
    </div>
    <div className={s.page__counter}>
      <Text tag={'p'} view={'title'} color={'primary'}>
        Total Cities
      </Text>
      {fetchedCities.length && (
        <Text tag={'p'} view={'p-20'} color={'accent'} weight={'bold'}>
          {fetchedCities.length}
        </Text>
      )}
    </div>
  </div>
);

interface CitiesPageListProps {
  windowWidth: number;
  isLoading: boolean;
  paginatedCities: CityType[];
}

const CitiesPageList: FC<CitiesPageListProps> = ({ windowWidth, isLoading, paginatedCities }) => (
  <ul className={cn(s.page__gallery, windowWidth <= 1440 && s.page__gallery_resize)}>
    {paginatedCities.map(({ id, ...city }) => (
      <ListCity currentCity={{ ...city, id }} action={<Button>Find ticket</Button>} isLoading={isLoading} key={id} />
    ))}
  </ul>
);

export const CitiesPage: FC = observer(() => {
  const windowWidth = useWindowWidth();
  const preInitializedQuery = new URLSearchParams(useLocation().search).get('query') ?? undefined;
  const { loadPaginatedCities } = citiesStore;
  // const [cities, setCities] = useState<CityType[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [totalCities, setTotalCities] = useState<number>(0);
  // const [searchQuery, setSearchQuery] = useState(preInitializedQuery ?? '');
  // const [dropdownValue, setDropdownValue] = useState<Option[]>([]);
  // const [dropdownOptions, setDropdownOptions] = useState<Option[]>([]);
  // const [currentPage, setCurrentPage] = useState<number>(1);
  // const [viewPerPage, setViewPerPageState] = useState<number>(3);
  // const [lastDocs, setLastDocs] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>[]>([]);

  // const getDropdownTitle = useCallback(
  //   (values: Option[]) => (values.length === 0 ? 'Choose Country' : values.map(({ value }) => value).join(', ')),
  //   []
  // );

  const setViewPerPage = useCallback((value: numbser) => {
    setViewPerPageState(value);
    setCurrentPage(1);
    setLastDocs([]);
  }, []);

  const onSearchFilter = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setLastDocs([]);
  }, []);

  // const selectedNames = useMemo(() => dropdownValue.map(({ value }) => value), [dropdownValue]);
  // const targetCursor = useMemo(() => {
  //   return currentPage === 1 ? null : (lastDocs[currentPage - 2] ?? null);
  // }, [currentPage, lastDocs]);

  // useEffect(() => {
  //   fetchCities({ mode: 'options' }).then((res) => {
  //     if (Array.isArray(res)) setDropdownOptions(res as Option[]);
  //   });
  // }, []);

  useEffect(() => {
    loadPaginatedCities();
  }, []);

  return (
    <div className={s.page}>
      <CitiesPageHeader />
      <CitiesPageActions
        preInitializedQuery={preInitializedQuery}
        onSearchFilter={onSearchFilter}
        dropdownOptions={dropdownOptions}
        dropdownValue={dropdownValue}
        setDropdownValue={setDropdownValue}
        getDropdownTitle={getDropdownTitle}
        viewPerPage={viewPerPage}
        setViewPerPage={setViewPerPage}
        fetchedCities={cities}
        totalCities={totalCities}
      />
      <CitiesPageList windowWidth={windowWidth} isLoading={isLoading} paginatedCities={cities} />
      <Pagination className={s.page__pagination} />
    </div>
  );
});
