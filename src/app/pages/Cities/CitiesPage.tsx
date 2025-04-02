import Text from '@shared/components/Text';
import { Search } from '@shared/components/Search';
import { Pagination } from '@shared/components/Pagination';
import MultiDropdown from '@shared/components/MultiDropdown';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Option } from '@shared/types/options';
import Button from '@shared/components/Button';
import s from './CitiesPage.module.scss';
import { useWindowWidth } from '@shared/hooks';
import cn from 'classnames';
import { useLocation } from 'react-router-dom';
import { Slider } from '@shared/components/Slider';
import { City } from '@shared/types/city';
import { ListCard } from '@shared/components/ListCard';
import { fetchCards } from '@shared/services/cities/fetchCards';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Range } from '@shared/types/slider';

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
  fetchedCities: City[];
  totalCities: number;
}

const CitiesPageActions: FC<CitiesPageActionsProps> = ({
  preInitializedQuery,
  onSearchFilter,
  dropdownOptions,
  dropdownValue,
  setDropdownValue,
  getDropdownTitle,
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
      {dropdownOptions && dropdownValue && (
        <MultiDropdown
          options={dropdownOptions}
          onChange={setDropdownValue}
          value={dropdownValue}
          getTitle={getDropdownTitle}
          className={s.page__dropdown}
        />
      )}
      <Slider min={3} max={Math.min(totalCities, 31) as Range<4, 31>} value={viewPerPage} onChange={setViewPerPage} />
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
  viewPerPage: number;
  paginatedCities: City[];
}

const CitiesPageList: FC<CitiesPageListProps> = ({ windowWidth, isLoading, viewPerPage, paginatedCities }) => (
  <ul className={cn(s.page__gallery, windowWidth <= 1440 && s.page__gallery_resize)}>
    {isLoading
      ? Array.from({ length: viewPerPage }).map((_, idx) => <ListCard isLoading key={idx} />)
      : paginatedCities.map(({ id, ...card }) => (
          <ListCard currentCard={{ ...card, id }} action={<Button>Find ticket</Button>} key={id} />
        ))}
  </ul>
);

export const CitiesPage: FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalCities, setTotalCities] = useState<number>(0);
  const windowWidth = useWindowWidth();
  const preInitializedQuery = new URLSearchParams(useLocation().search).get('query') ?? undefined;
  const [searchQuery, setSearchQuery] = useState(preInitializedQuery ?? '');
  const [dropdownValue, setDropdownValue] = useState<Option[]>([]);
  const [dropdownOptions, setDropdownOptions] = useState<Option[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewPerPage, setViewPerPageState] = useState<number>(3);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null);

  const getDropdownTitle = useCallback(
    (values: Option[]) => (values.length === 0 ? 'Choose City' : values.map(({ value }) => value).join(', ')),
    []
  );

  const setViewPerPage = useCallback((value: number) => {
    setViewPerPageState(value);
    setCurrentPage(1);
    setLastDoc(null);
  }, []);

  const onSearchFilter = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const selectedNames = useMemo(() => dropdownValue.map(({ value }) => value.toLowerCase()), [dropdownValue]);
  const currentLastDoc = useMemo(() => (currentPage > 1 ? lastDoc : null), [currentPage, lastDoc]);

  useEffect(() => {
    fetchCards({ mode: 'options' }).then((res) => {
      if (Array.isArray(res)) setDropdownOptions(res as Option[]);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);

    fetchCards({
      mode: 'paginate',
      perPage: viewPerPage,
      searchQuery,
      filters: selectedNames,
      lastDoc: currentLastDoc,
    })
      .then((res) => {
        if (typeof res !== 'string' && 'data' in res) {
          let cities = res.data;

          if (res.lastRequest === 'filter' && searchQuery) {
            cities = cities.filter((city) => city.name.toLowerCase().includes(searchQuery.toLowerCase()));
          }

          if (res.lastRequest === 'search' && selectedNames.length) {
            cities = cities.filter((city) => selectedNames.includes(city.name.toLowerCase()));
          }

          setLastDoc(res.lastDoc);
          setCities(cities);
          setTotalCities(res.total);
        }
      })
      .finally(() => setIsLoading(false));
  }, [dropdownValue, searchQuery, viewPerPage, currentLastDoc, selectedNames, currentPage]);

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
      <CitiesPageList
        windowWidth={windowWidth}
        isLoading={isLoading}
        viewPerPage={viewPerPage}
        paginatedCities={cities}
      />
      <Pagination
        total={totalCities}
        perPage={viewPerPage}
        currentPage={currentPage}
        onChange={(page) => setCurrentPage(page)}
        className={s.page__pagination}
      />
    </div>
  );
};
