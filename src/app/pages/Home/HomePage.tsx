import { FC, useEffect, useState } from 'react';
import { Search } from '@shared/components/Search';
import Text from '@shared/components/Text';
import s from './HomePage.module.scss';
import { useCitiesContext } from '@shared/hooks';
import { Link, useNavigate } from 'react-router-dom';
import Card from '@shared/components/Card';
import { CITIES } from '@shared/constants/links';
import Button from '@shared/components/Button';
import { useWindowWidth } from '@shared/hooks';
import cn from 'classnames';
import { fetchCards } from '@shared/services/cities/fetchCards';
import { City } from '@shared/types/city';

export const HomePage: FC = () => {
  const { randomCity } = useCitiesContext();
  const navigation = useNavigate();
  const windowWidth = useWindowWidth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [relatedCities, setRelatedCities] = useState<City[]>([]);

  useEffect(() => {
    setIsLoading(true);

    fetchCards({
      mode: 'related',
      relatedCards: 6,
    })
      .then((res) => {
        if (Array.isArray(res)) {
          setRelatedCities(res as City[]);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

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
            ? Array.from({ length: 6 }).map((_, idx) => (
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
            : relatedCities.map(({ id, country, name, is_capital, population, image }) => (
                <li key={id} className={s['page__gallery-item']}>
                  <Link to={`${CITIES}/${id}`} className={s.page__link}>
                    <Card
                      cardId={id}
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
