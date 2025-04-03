import { FC, useEffect, useState } from 'react';
import s from './CityPage.module.scss';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import { useParams } from 'react-router-dom';
import { BackButton } from '@shared/components/BackButton';
import { ListCity } from '@shared/components/ListCity';
import { CityDetail } from '@shared/components/CityDetail';
import { fetchCities } from '@shared/services/cities/fetchCities';
import { CityType } from '@shared/types/city';

export const CityPage: FC = () => {
  const { id: currentCityId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentCity, setCurrentCity] = useState<CityType | null>(null);
  const [relatedCities, setRelatedCities] = useState<CityType[]>([]);

  useEffect(() => {
    setIsLoading(true);

    fetchCities({
      mode: 'single',
      currentCityId,
    })
      .then((res) => {
        if (typeof res !== 'string') {
          setCurrentCity(res as CityType);
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
          setRelatedCities(res as CityType[]);
        }
      })
      .finally(() => setIsLoading(false));
  }, [currentCityId]);

  return (
    <div className={s.page}>
      <BackButton className={s.page__back}>Back</BackButton>
      {
        <CityDetail
          currentCity={currentCity ?? undefined}
          action={<Button>Find ticket</Button>}
          className={s.page__city}
        />
      }
      <section className={s.page__related}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Related Cities
        </Text>
        <ul className={s.page__gallery}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => <ListCity isLoading={isLoading} key={idx} />)
            : relatedCities.map(({ id, ...city }) => (
                <ListCity currentCity={{ ...city, id }} action={<Button>Find ticket</Button>} key={id} />
              ))}
        </ul>
      </section>
    </div>
  );
};
