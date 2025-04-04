import { FC, useEffect } from 'react';
import { Search } from '@shared/components/Search';
import Text from '@shared/components/Text';
import s from './HomePage.module.scss';
import { useNavigate } from 'react-router-dom';
import { CITIES } from '@shared/constants/links';
import Button from '@shared/components/Button';
import { useWindowWidth } from '@shared/hooks';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { citiesStore } from '@shared/stores';
import { ListCity } from '@shared/components/ListCity';

export const HomePage: FC = observer(() => {
  const { randomCity, fetchRelated, relatedCities, isLoading } = citiesStore;
  const navigation = useNavigate();
  const windowWidth = useWindowWidth();
  const relatedNumber = 6;

  useEffect(() => {
    (async () => await fetchRelated(relatedNumber))();
  }, [fetchRelated]);

  const onSearchFilter = (value: string) => {
    navigation({ pathname: CITIES, search: `?query=${value}` });
  };

  const handleSuggest = () => {
    navigation({ pathname: `${CITIES}/${randomCity?.id}` });
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
          <Search onSearchFilter={onSearchFilter} actionName={'Find now'} placeholder={'Search City'} />
        </div>
      </div>
      <section className={s.page__related}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Related Cities
        </Text>
        <ul className={cn(s.page__gallery, windowWidth <= 1440 && s.page__gallery_resize)}>
          {isLoading
            ? Array.from({ length: relatedNumber }).map((_, idx) => <ListCity isLoading={isLoading} key={idx} />)
            : relatedCities.map(({ id, ...city }) => (
                <ListCity currentCity={{ ...city, id }} action={<Button>Find ticket</Button>} key={id} />
              ))}
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
