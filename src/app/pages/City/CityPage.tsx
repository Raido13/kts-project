import { FC, useEffect } from 'react';
import s from './CityPage.module.scss';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import { useParams } from 'react-router-dom';
import { BackButton } from '@shared/components/BackButton';
import { ListCity } from '@shared/components/ListCity';
import { CityDetail } from '@shared/components/CityDetail';
import { observer } from 'mobx-react-lite';
import { citiesStore } from '@shared/stores';

export const CityPage: FC = observer(() => {
  const { id: currentCityId } = useParams();
  const { fetchRelated, fetchCurrent, relatedCities, currentCity, isLoading } = citiesStore;
  const relatedNumber = 3;

  useEffect(() => {
    (async () => await fetchRelated(relatedNumber))();
    if (currentCityId) (async () => fetchCurrent(currentCityId))();
  }, [currentCityId, fetchRelated, fetchCurrent]);

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
            ? Array.from({ length: relatedNumber }).map((_, idx) => <ListCity isLoading={isLoading} key={idx} />)
            : relatedCities.map(({ id, ...city }) => (
                <ListCity currentCity={{ ...city, id }} action={<Button>Find ticket</Button>} key={id} />
              ))}
        </ul>
      </section>
    </div>
  );
});
