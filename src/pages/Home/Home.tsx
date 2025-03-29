import { FC, useMemo } from 'react';
import { Search } from '@shared/ui/Search';
import Text from '@shared/ui/Text';
import s from './Home.module.scss';
import { useCitiesContext } from '@shared/lib/hooks/useCitiesContext';
import { getShuffledItemsFromArray } from '@shared/lib/utils/utils';
import { Link, useNavigate } from 'react-router-dom';
import Card from '@shared/ui/Card';
import { CITIES } from '@shared/lib/constants/links';
import Button from '@shared/ui/Button';
import { useWindowWidth } from '@shared/lib/hooks/useWindowWidth';
import cn from 'classnames';

export const HomePage: FC = () => {
  const { cities, isLoading, randomCity } = useCitiesContext();
  const navigation = useNavigate();
  const windowWidth = useWindowWidth();

  const relatedCities = useMemo(() => getShuffledItemsFromArray(cities, 6), [cities]);

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
        <div className={s.page__toolbar__container}>
          <Search onSearchFilter={onSearchFilter} actionName={'Find now'} placeholder={'Search City'} />
        </div>
      </div>
      <section className={s.page__related}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Related Cities
        </Text>
        <ul className={cn(s.page__gallery, windowWidth <= 1440 && s.page__gallery_resize)}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <li key={idx} className={s.page__city}>
                  <Card
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
            : relatedCities.map(({ id, country, name, is_capital, population, image }) => (
                <li key={id} className={s['page__gallery-item']}>
                  <Link to={`${CITIES}/${id}`} className={s.page__link}>
                    <Card
                      image={image}
                      title={name}
                      subtitle={`Population: ${population}`}
                      captionSlot={`Country: ${country}`}
                      contentSlot={is_capital && 'Capital'}
                      actionSlot={<Button isSkeletonLoading={isLoading}>More info</Button>}
                      isLoading={isLoading}
                    />
                  </Link>
                </li>
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
};
