import Text from '@shared/components/Text';
import { Search } from '@shared/components/Search';
import { Pagination } from '@shared/components/Pagination';
import MultiDropdown from '@shared/components/MultiDropdown';
import { FC, useCallback, useMemo, useState } from 'react';
import { Option } from '@shared/types/options';
import Button from '@shared/components/Button';
import s from './CitiesPage.module.scss';
import { useWindowWidth } from '@shared/hooks';
import cn from 'classnames';
import { useLocation } from 'react-router-dom';
import { useCitiesContext } from '@shared/hooks';
import { Slider } from '@shared/components/Slider';
import { City } from '@shared/types/city';
import { ListCard } from '@shared/components/ListCard';

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
  filteredCities: City[];
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
  filteredCities,
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
      {filteredCities.length && (
        <Text tag={'p'} view={'p-20'} color={'accent'} weight={'bold'}>
          {filteredCities.length}
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
  const { cities, isLoading } = useCitiesContext();
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

  const dropdownOptions = useMemo(() => {
    return cities.map((city) => ({
      value: city.name,
      key: city.id,
    }));
  }, [cities]);

  const filteredCities = useMemo(() => {
    const selectedNames = dropdownValue.map(({ value }) => value.toLowerCase());

    return cities.filter(({ name }) => {
      const matchesDropdown = selectedNames.length === 0 || selectedNames.includes(name.toLowerCase());
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDropdown && matchesSearch;
    });
  }, [dropdownValue, cities, searchQuery]);

  const onSearchFilter = (value: string) => {
    setSearchQuery(value);
  };

  const startIdx = (currentPage - 1) * viewPerPage;

  const paginatedCities = useMemo(
    () => filteredCities.slice(startIdx, startIdx + viewPerPage),
    [filteredCities, startIdx, viewPerPage]
  );

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
        filteredCities={filteredCities}
      />
      <CitiesPageList
        windowWidth={windowWidth}
        isLoading={isLoading}
        viewPerPage={viewPerPage}
        paginatedCities={paginatedCities}
      />
      <Pagination
        total={filteredCities.length}
        perPage={viewPerPage}
        currentPage={currentPage}
        onChange={(page) => setCurrentPage(page)}
        className={s.page__pagination}
      />
    </div>
  );
};
