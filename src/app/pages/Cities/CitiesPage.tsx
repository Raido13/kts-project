import Text from '@shared/components/Text';
import { Search } from '@shared/components/Search';
import { Pagination } from '@shared/components/Pagination';
import MultiDropdown from '@shared/components/MultiDropdown';
import { FC, useCallback, useEffect, useState } from 'react';
import { Option } from '@shared/types/options';
import Button from '@shared/components/Button';
import s from './CitiesPage.module.scss';
import { useWindowWidth } from '@shared/hooks';
import cn from 'classnames';
import { useLocation } from 'react-router-dom';
import { Slider } from '@shared/components/Slider';
import { City } from '@shared/types/city';
import { ListCard } from '@shared/components/ListCard';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { fetchCards } from '@shared/services/cities/fetchCards';

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
  cities: City[];
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
  cities,
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
      <Slider min={3} max={30} value={viewPerPage} onChange={setViewPerPage} />
    </div>
    <div className={s.page__counter}>
      <Text tag={'p'} view={'title'} color={'primary'}>
        Total Cities
      </Text>
      {cities.length && (
        <Text tag={'p'} view={'p-20'} color={'accent'} weight={'bold'}>
          {cities.length}
        </Text>
      )}
    </div>
  </div>
);

interface CitiesPageListProps {
  windowWidth: number;
  isLoading: boolean;
  viewPerPage: number;
  cities: City[];
}

const CitiesPageList: FC<CitiesPageListProps> = ({ windowWidth, isLoading, viewPerPage, cities }) => (
  <ul className={cn(s.page__gallery, windowWidth <= 1440 && s.page__gallery_resize)}>
    {isLoading
      ? Array.from({ length: viewPerPage }).map((_, idx) => <ListCard isLoading key={idx} />)
      : cities.map(({ id, ...card }) => (
          <ListCard currentCard={{ ...card, id }} action={<Button>Find ticket</Button>} key={id} />
        ))}
  </ul>
);

export const CitiesPage: FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [lastDocs, setLastDocs] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [dropdownOptions, setDropdownOptions] = useState<Option[]>([]);

  const windowWidth = useWindowWidth();
  const preInitializedQuery = new URLSearchParams(useLocation().search).get('query') ?? undefined;
  const [searchQuery, setSearchQuery] = useState(preInitializedQuery ?? '');
  const [dropdownValue, setDropdownValue] = useState<Option[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewPerPage, setViewPerPage] = useState<number>(3);

  const getDropdownTitle = useCallback(
    (values: Option[]) => (values.length === 0 ? 'Choose City' : values.map(({ value }) => value).join(', ')),
    []
  );

  const onSearchFilter = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setLastDocs([]);
  };

  const handlePagination = useCallback(
    async (page: number) => {
      setIsLoading(true);
      setCurrentPage(page);

      const selectedNames = dropdownValue.map((d) => d.value);
      const targetCursor = page === 1 ? null : lastDocs[page - 2];

      fetchCards({
        mode: 'paginate',
        perPage: viewPerPage,
        searchQuery,
        filters: selectedNames,
        lastDoc: targetCursor,
      })
        .then((res) => {
          if (typeof res !== 'string' && 'data' in res) {
            setCities(res.data);
            setTotalCount(res.total);

            if (page === lastDocs.length + 1) {
              setLastDocs([...lastDocs, res.lastDoc]);
            }
          }
        })
        .finally(() => setIsLoading(false));
    },
    [viewPerPage, searchQuery, dropdownValue, lastDocs]
  );

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      const res = (await fetchCards({ mode: 'filter' })) as Option[];
      if (Array.isArray(res)) setDropdownOptions(res);
    };

    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    handlePagination(currentPage);
  }, [currentPage, handlePagination]);

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
        cities={cities}
      />
      <CitiesPageList windowWidth={windowWidth} isLoading={isLoading} viewPerPage={viewPerPage} cities={cities} />
      <Pagination
        total={totalCount}
        perPage={viewPerPage}
        currentPage={currentPage}
        onChange={handlePagination}
        className={s.page__pagination}
      />
    </div>
  );
};
