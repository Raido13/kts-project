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
import { useMinLoading } from '@shared/hooks';

export const CityPage: FC = observer(() => {
  const { id: currentCityId } = useParams();
  const { fetchRelated, fetchCurrent, relatedCities, currentCity } = citiesStore;
  const relatedNumber = 3;
  const { isLoading } = useMinLoading();

  useEffect(() => {
    (async () => await fetchRelated(relatedNumber))();
    if (currentCityId) (async () => fetchCurrent(currentCityId))();
  }, [currentCityId, fetchRelated, fetchCurrent]);

  return (
    <div className={s.page}>
      <BackButton className={s.page__back}>Back</BackButton>
      {
        <CityDetail
          city={currentCity ?? undefined}
          action={<Button skeletonLoading={true}>Find ticket</Button>}
          className={s.page__city}
          variant={'single'}
        />
      }
      <section className={s.page__related}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Related Cities
        </Text>
        <ul className={s.page__gallery}>
          {isLoading
            ? Array.from({ length: relatedNumber }).map((_, idx) => <ListCity key={idx} />)
            : relatedCities.map(({ id, ...city }) => (
                <ListCity
                  city={{ ...city, id }}
                  action={<Button skeletonLoading={true}>Find ticket</Button>}
                  key={id}
                />
              ))}
        </ul>
      </section>
    </div>
  );
});
