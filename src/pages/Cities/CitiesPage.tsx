import Text from '@shared/ui/Text';
import { Search } from '@shared/ui/Search';
import { Pagination } from '@shared/ui/Pagination';
import MultiDropdown from '@shared/ui/MultiDropdown';
import Card from '@shared/ui/Card';
import { FC, useCallback, useMemo, useState } from 'react';
import { Option } from '@shared/lib/types/options';
import Button from '@shared/ui/Button';
import s from './CitiesPage.module.scss';
import { useWindowWidth } from '@shared/lib/hooks';
import cn from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { CITIES } from '@shared/lib/constants/links';
import { useCitiesContext } from '@shared/lib/hooks';
import { Slider } from '@shared/ui/Slider';

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
      <section className={s.page__description}>
        <Text tag={'h2'} view={'title'} color={'primary'}>
          Citypedia
        </Text>
        <Text tag={'p'} view={'p-20'} color={'secondary'}>
          Explore major cities around the world and discover key information about each one. Find out their population,
          capital status, and the country they belong to — all in one place.
        </Text>
      </section>
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
      <ul className={cn(s.page__gallery, windowWidth <= 1440 && s.page__gallery_resize)}>
        {isLoading
          ? Array.from({ length: viewPerPage }).map((_, idx) => (
              <li key={idx} className={s.page__city}>
                <Card
                  cardId=""
                  image=""
                  title=""
                  subtitle=""
                  captionSlot=""
                  contentSlot=""
                  actionSlot={<Button isSkeletonLoading>{''}</Button>}
                  isLoading
                />
              </li>
            ))
          : paginatedCities.map(({ id, country, name, is_capital, population, image }) => (
              <li key={id} className={s.page__city}>
                <Link to={`${CITIES}/${id}`} className={s.page__link}>
                  <Card
                    cardId={id}
                    image={image}
                    title={name}
                    subtitle={`Population: ${population}`}
                    captionSlot={`Country: ${country}`}
                    contentSlot={is_capital && 'Capital'}
                    actionSlot={<Button>Find ticket</Button>}
                  />
                </Link>
              </li>
            ))}
      </ul>
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
