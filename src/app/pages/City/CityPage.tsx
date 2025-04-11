import { FC, useEffect, useMemo, useRef } from 'react';
import s from './CityPage.module.scss';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import { useParams } from 'react-router-dom';
import { BackButton } from '@shared/components/BackButton';
import { CityDetail } from '@shared/components/CityDetail';
import { observer } from 'mobx-react-lite';
import { CitiesList } from '@shared/components/CitiesList';
import { useRootStore } from '@shared/hooks';

const RELATED_NUMBER = 3;

export const CityPage: FC = observer(() => {
  const { id: currentCityId } = useParams();
  const { citiesStore } = useRootStore();
  const { fetchRelated, clearRelated, fetchCurrent, isLoading, citiesDataStore } = citiesStore;
  const { relatedCities, currentCity } = useMemo(
    () => ({
      relatedCities: citiesDataStore.relatedCities,
      currentCity: citiesDataStore.currentCity,
    }),
    [citiesDataStore.relatedCities, citiesDataStore.currentCity]
  );
  const hasFetched = useRef(false);

  useEffect(() => {
    if (currentCityId) {
      (async () => await fetchCurrent(currentCityId))();
    }
  }, [currentCityId, fetchCurrent]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    (async () => await fetchRelated(RELATED_NUMBER))();

    return () => clearRelated();
  }, [hasFetched, fetchRelated, clearRelated]);

  return (
    <div className={s.page}>
      <BackButton className={s.page__back}>Back</BackButton>
      <CityDetail
        city={currentCity ?? undefined}
        action={<Button skeletonLoading={true}>Find ticket</Button>}
        className={s.page__city}
        variant={'single'}
        isLoading={isLoading}
      />
      <section className={s.page__related}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Related Cities
        </Text>
        <CitiesList loadingCities={RELATED_NUMBER} isLoading={isLoading} cities={relatedCities} />
      </section>
    </div>
  );
});
