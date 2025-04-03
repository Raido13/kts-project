import { FC, useEffect, useState } from 'react';
import s from './CityPage.module.scss';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import { useParams } from 'react-router-dom';
import { BackButton } from '@shared/components/BackButton';
import { ListCard } from '@shared/components/ListCard';
import { CardDetail } from '@shared/components/CardDetail';
import { fetchCities } from '@shared/services/cities/fetchCities';
import { City } from '@shared/types/city';

export const CityPage: FC = () => {
  const { id: currentCityId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [relatedCities, setRelatedCities] = useState<City[]>([]);

  useEffect(() => {
    setIsLoading(true);

    fetchCities({
      mode: 'single',
      currentCityId,
    })
      .then((res) => {
        if (typeof res !== 'string') {
          setCurrentCity(res as City);
        }
      })
      .finally(() => setIsLoading(false));

    fetchCities({
      mode: 'related',
      currentCityId,
      relatedCities: 3,
    })
      .then((res) => {
        if (Array.isArray(res)) {
          setRelatedCities(res as City[]);
        }
      })
      .finally(() => setIsLoading(false));
  }, [currentCityId]);

  return (
    <div className={s.city}>
      <BackButton className={s.city__back}>Back</BackButton>
      {
        <CardDetail
          currentCard={currentCity ?? undefined}
          action={<Button>Find ticket</Button>}
          className={s.city__card}
        />
      }
      <section className={s.city__related}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Related Cities
        </Text>
        <ul className={s.city__gallery}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => <ListCard isLoading={isLoading} key={idx} />)
            : relatedCities.map(({ id, ...city }) => (
                <ListCard currentCard={{ ...city, id }} action={<Button>Find ticket</Button>} key={id} />
              ))}
        </ul>
      </section>
    </div>
  );
};
