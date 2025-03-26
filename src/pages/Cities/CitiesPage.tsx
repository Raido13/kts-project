import Text from '@shared/ui/Text';
import { Search } from '@shared/ui/Search';
import { Pagination } from '@shared/ui/Pagination';
import MultiDropdown from '@shared/ui/MultiDropdown';
import Card from '@shared/ui/Card';
import { useEffect, useState } from 'react';
import { City } from '@shared/lib/types/city';
import { Option } from '@shared/lib/types/options';
import Button from '@shared/ui/Button';
import s from './CitiesPage.module.scss';

export const cities = [
  { id: 1, country: 'Russia', name: 'Moscow', is_capital: true, population: 13010112 },
  { id: 2, country: 'USA', name: 'New York', is_capital: false, population: 8419600 },
  { id: 3, country: 'USA', name: 'Washington D.C.', is_capital: true, population: 714153 },
  { id: 4, country: 'France', name: 'Paris', is_capital: true, population: 2148000 },
  { id: 5, country: 'Germany', name: 'Berlin', is_capital: true, population: 3769000 },
  { id: 6, country: 'Japan', name: 'Tokyo', is_capital: true, population: 13960000 },
  { id: 7, country: 'China', name: 'Beijing', is_capital: true, population: 21540000 },
  { id: 8, country: 'Brazil', name: 'São Paulo', is_capital: false, population: 12300000 },
  { id: 9, country: 'Brazil', name: 'Brasília', is_capital: true, population: 3055149 },
  { id: 10, country: 'UK', name: 'London', is_capital: true, population: 8982000 },
  { id: 11, country: 'Spain', name: 'Madrid', is_capital: true, population: 3266000 },
  { id: 12, country: 'Italy', name: 'Rome', is_capital: true, population: 2873000 },
  { id: 13, country: 'Canada', name: 'Toronto', is_capital: false, population: 2732000 },
  { id: 14, country: 'Canada', name: 'Ottawa', is_capital: true, population: 934243 },
  { id: 15, country: 'Australia', name: 'Sydney', is_capital: false, population: 5312000 },
  { id: 16, country: 'Australia', name: 'Canberra', is_capital: true, population: 462000 },
  { id: 17, country: 'India', name: 'Mumbai', is_capital: false, population: 12440000 },
  { id: 18, country: 'India', name: 'New Delhi', is_capital: true, population: 3187000 },
  { id: 19, country: 'South Korea', name: 'Seoul', is_capital: true, population: 9776000 },
  { id: 20, country: 'Mexico', name: 'Mexico City', is_capital: true, population: 9209944 },
  { id: 21, country: 'Turkey', name: 'Istanbul', is_capital: false, population: 15460000 },
  { id: 22, country: 'Turkey', name: 'Ankara', is_capital: true, population: 5503985 },
  { id: 23, country: 'South Africa', name: 'Cape Town', is_capital: false, population: 4337000 },
  { id: 24, country: 'South Africa', name: 'Pretoria', is_capital: true, population: 741651 },
  { id: 25, country: 'Argentina', name: 'Buenos Aires', is_capital: true, population: 2890000 },
  { id: 26, country: 'Egypt', name: 'Cairo', is_capital: true, population: 10230000 },
  { id: 27, country: 'Nigeria', name: 'Lagos', is_capital: false, population: 14610000 },
  { id: 28, country: 'Nigeria', name: 'Abuja', is_capital: true, population: 1235880 },
  { id: 29, country: 'Indonesia', name: 'Jakarta', is_capital: true, population: 10770487 },
  { id: 30, country: 'Pakistan', name: 'Islamabad', is_capital: true, population: 1014825 },
  { id: 31, country: 'Russia', name: 'Moscow', is_capital: true, population: 13010112 },
  { id: 32, country: 'USA', name: 'New York', is_capital: false, population: 8419600 },
  { id: 33, country: 'USA', name: 'Washington D.C.', is_capital: true, population: 714153 },
  { id: 34, country: 'France', name: 'Paris', is_capital: true, population: 2148000 },
  { id: 35, country: 'Germany', name: 'Berlin', is_capital: true, population: 3769000 },
  { id: 36, country: 'Japan', name: 'Tokyo', is_capital: true, population: 13960000 },
  { id: 37, country: 'China', name: 'Beijing', is_capital: true, population: 21540000 },
  { id: 38, country: 'Brazil', name: 'São Paulo', is_capital: false, population: 12300000 },
  { id: 39, country: 'Brazil', name: 'Brasília', is_capital: true, population: 3055149 },
  { id: 40, country: 'UK', name: 'London', is_capital: true, population: 8982000 },
  { id: 41, country: 'Spain', name: 'Madrid', is_capital: true, population: 3266000 },
  { id: 42, country: 'Italy', name: 'Rome', is_capital: true, population: 2873000 },
  { id: 43, country: 'Canada', name: 'Toronto', is_capital: false, population: 2732000 },
  { id: 44, country: 'Canada', name: 'Ottawa', is_capital: true, population: 934243 },
  { id: 45, country: 'Australia', name: 'Sydney', is_capital: false, population: 5312000 },
  { id: 46, country: 'Australia', name: 'Canberra', is_capital: true, population: 462000 },
  { id: 47, country: 'India', name: 'Mumbai', is_capital: false, population: 12440000 },
  { id: 48, country: 'India', name: 'New Delhi', is_capital: true, population: 3187000 },
  { id: 49, country: 'South Korea', name: 'Seoul', is_capital: true, population: 9776000 },
  { id: 50, country: 'Mexico', name: 'Mexico City', is_capital: true, population: 9209944 },
  { id: 51, country: 'Turkey', name: 'Istanbul', is_capital: false, population: 15460000 },
  { id: 52, country: 'Turkey', name: 'Ankara', is_capital: true, population: 5503985 },
  { id: 53, country: 'South Africa', name: 'Cape Town', is_capital: false, population: 4337000 },
  { id: 54, country: 'South Africa', name: 'Pretoria', is_capital: true, population: 741651 },
  { id: 55, country: 'Argentina', name: 'Buenos Aires', is_capital: true, population: 2890000 },
  { id: 56, country: 'Egypt', name: 'Cairo', is_capital: true, population: 10230000 },
  { id: 57, country: 'Nigeria', name: 'Lagos', is_capital: false, population: 14610000 },
  { id: 58, country: 'Nigeria', name: 'Abuja', is_capital: true, population: 1235880 },
  { id: 59, country: 'Indonesia', name: 'Jakarta', is_capital: true, population: 10770487 },
  { id: 60, country: 'Pakistan', name: 'Islamabad', is_capital: true, population: 1014825 },
];

const imageMock = 'https://avatars.githubusercontent.com/u/45487711?s=280&v=4';

export const CitiesPage = () => {
  const [initialCities, setInitialCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>(initialCities);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dropdownOptions, setDropdownOptions] = useState<Option[]>([]);
  const [dropdownValue, setDropdownValue] = useState<Option[]>([]);

  const getDropdownTitle = (values: Option[]) =>
    values.length === 0 ? 'Choose City' : values.map(({ value }) => value).join(', ');

  const onFilterChange = (filteredCities: City[]) => {
    setFilteredCities(filteredCities);
  };

  useEffect(() => {
    setInitialCities(cities);
    const currentOptions = cities.map((city) => ({ value: city.name, key: `${city.id}` }));

    setDropdownOptions(currentOptions);
  }, []);

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
            initialCities={initialCities}
            onFilterChange={onFilterChange}
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
          {initialCities.length !== 0 && (
            <Text tag={'p'} view={'p-20'} color={'accent'}>
              {initialCities.length}
            </Text>
          )}
        </div>
      </div>
      <ul className={s.page__gallery}>
        {filteredCities &&
          filteredCities.map(({ id, country, name, is_capital, population }) => (
            <li key={id} className={s.page__city}>
              <Card
                image={imageMock}
                title={name}
                subtitle={`Population: ${population}`}
                captionSlot={`Country ${country}`}
                contentSlot={is_capital && ['Capital']}
                actionSlot={<Button>More info</Button>}
              />
            </li>
          ))}
      </ul>
      <Pagination
        total={initialCities.length}
        perPage={6}
        currentPage={currentPage}
        onChange={(page) => setCurrentPage(page)}
        siblingCount={2}
        className={s.page__pagination}
      />
    </div>
  );
};
