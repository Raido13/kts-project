import { FC, useEffect, useMemo } from 'react';
import s from './CityPage.module.scss';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import { useParams } from 'react-router-dom';
import { BackButton } from '@shared/components/BackButton';
import { CityDetail } from '@shared/components/CityDetail';
import { observer } from 'mobx-react-lite';
import { citiesStore } from '@shared/stores';
import { CitiesList } from '@shared/components/CitiesList';

export const CityPage: FC = observer(() => {
  const { id: currentCityId } = useParams();
  const { fetchRelated, fetchCurrent, combinedLoading: isLoading, citiesDataStore } = citiesStore;
  const { relatedCities, currentCity } = useMemo(
    () => ({
      relatedCities: citiesDataStore.relatedCities,
      currentCity: citiesDataStore.currentCity,
    }),
    [citiesDataStore.relatedCities, citiesDataStore.currentCity]
  );
  const relatedNumber = 3;

  useEffect(() => {
    void fetchRelated(relatedNumber);
    if (currentCityId) {
      void fetchCurrent(currentCityId);
    }
  }, [currentCityId, fetchRelated, fetchCurrent]);

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
        <ul className={s.page__gallery}>
          <CitiesList loadingCities={relatedNumber} isLoading={isLoading} cities={relatedCities} />
        </ul>
      </section>
    </div>
  );
});
