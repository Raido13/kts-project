import Text from '@shared/ui/Text';
import { Search } from '@shared/ui/Search';
import { Pagination } from '@shared/ui/Pagination';
import MultiDropdown from '@shared/ui/MultiDropdown';
import Card from '@shared/ui/Card';
import { FC, useCallback, useEffect, useState } from 'react';
import { City } from '@shared/lib/types/city';
import { Option } from '@shared/lib/types/options';
import Button from '@shared/ui/Button';
import s from './CitiesPage.module.scss';
import { citiesMock, imageMock } from '@shared/lib/mock/cities';

export const CitiesPage: FC = () => {
  const [initialCities, setInitialCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [dropdownOptions, setDropdownOptions] = useState<Option[]>([]);
  const [dropdownValue, setDropdownValue] = useState<Option[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const perPage = 6;
  const startIdx = (currentPage - 1) * perPage;
  const paginatedCities = filteredCities.slice(startIdx, startIdx + perPage);

  const getDropdownTitle = (values: Option[]) =>
    values.length === 0 ? 'Choose City' : values.map(({ value }) => value).join(', ');

  const onSearchFilter = useCallback(() => {
    const selectedNames = dropdownValue.map(({ value }) => value.toLowerCase());

    const filtered = initialCities.filter(({ name }) => {
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDropdown = selectedNames.length === 0 || selectedNames.includes(name.toLowerCase());

      return matchesSearch && matchesDropdown;
    });

    setFilteredCities(filtered);
    setCurrentPage(1);
  }, [dropdownValue, searchQuery, initialCities]);

  useEffect(() => {
    setInitialCities(citiesMock);
    setFilteredCities(citiesMock);
    const currentOptions = citiesMock.map((city) => ({ value: city.name, key: `${city.id}` }));

    setDropdownOptions(currentOptions);
  }, []);

  useEffect(() => {
    onSearchFilter();
  }, [dropdownValue, initialCities, onSearchFilter]);

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
        <div className={s.page__toolbar__container}>
          <Search
            onSearchFilter={onSearchFilter}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
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
        </div>
        <div className={s.page__counter}>
          <Text tag={'p'} view={'title'} color={'primary'}>
            Total Cities
          </Text>
          {filteredCities.length !== 0 && (
            <Text tag={'p'} view={'p-20'} color={'accent'} weight={'bold'}>
              {filteredCities.length}
            </Text>
          )}
        </div>
      </div>
      <ul className={s.page__gallery}>
        {paginatedCities &&
          paginatedCities.map(({ id, country, name, is_capital, population }) => (
            <li key={id} className={s.page__city}>
              <Card
                image={imageMock}
                title={name}
                subtitle={`Population: ${population}`}
                captionSlot={`Country ${country}`}
                contentSlot={is_capital && 'Capital'}
                actionSlot={<Button>More info</Button>}
              />
            </li>
          ))}
      </ul>
      <Pagination
        total={filteredCities.length}
        perPage={perPage}
        currentPage={currentPage}
        onChange={(page) => setCurrentPage(page)}
        className={s.page__pagination}
      />
    </div>
  );
};
