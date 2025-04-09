import { FC, useEffect, useMemo } from 'react';
import { Search } from '@shared/components/Search';
import Text from '@shared/components/Text';
import s from './HomePage.module.scss';
import { useNavigate } from 'react-router-dom';
import { CITIES } from '@shared/constants/links';
import Button from '@shared/components/Button';
import { useRootStore, useWindowWidth } from '@shared/hooks';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { CitiesList } from '@shared/components/CitiesList';

const RELATED_NUMBER = 6;

export const HomePage: FC = observer(() => {
  const rootStoreContext = useRootStore();
  const { fetchRelated, citiesDataStore, isLoading } = rootStoreContext.citiesStore;
  const { relatedCities, mostLikedCity } = useMemo(
    () => ({
      relatedCities: citiesDataStore.relatedCities,
      mostLikedCity: citiesDataStore.mostLikedCity,
    }),
    [citiesDataStore.relatedCities, citiesDataStore.mostLikedCity]
  );
  const navigation = useNavigate();
  const windowWidth = useWindowWidth();

  useEffect(() => {
    (async () => await fetchRelated(RELATED_NUMBER))();
  }, [fetchRelated]);

  const onSearchFilter = (value: string) => {
    navigation({ pathname: CITIES, search: `?query=${value}` });
  };

  const handleSuggest = () => {
    navigation({ pathname: `${CITIES}/${mostLikedCity?.id}` });
  };

  return (
    <div className={s.page}>
      <section className={s.page__description}>
        <Text tag={'h2'} view={'title'} color={'primary'}>
          Discover Cities Around the World with Citypedia
        </Text>
        <Text tag={'p'} view={'p-20'} color={'secondary'}>
          Dive into a collection of global cities — their culture, population, and stories waiting to be explored
        </Text>
      </section>
      <div className={s.page__toolbar}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Start your journey
        </Text>
        <div className={s['page__toolbar-container']}>
          <Search
            onSearchFilter={onSearchFilter}
            actionName={'Find now'}
            placeholder={'Search City'}
            disabled={isLoading}
          />
        </div>
      </div>
      <section className={s.page__related}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Related Cities
        </Text>
        <ul className={cn(s.page__gallery, windowWidth <= 1440 && s.page__gallery_resize)}>
          <CitiesList loadingCities={RELATED_NUMBER} isLoading={isLoading} cities={relatedCities} />
        </ul>
      </section>
      <div className={s.page__suggest}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Not sure where to go?
        </Text>
        <div className={s.page__suggest__container}>
          <Button onClick={() => handleSuggest()}>Suggest me a city</Button>
        </div>
      </div>
    </div>
  );
});
