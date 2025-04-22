import { FC, useEffect } from 'react';
import s from './CityPage.module.scss';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import { useParams } from 'react-router-dom';
import { BackButton } from '@shared/components/BackButton';
import { CardDetail } from '@shared/components/CardDetail';
import { observer } from 'mobx-react-lite';
import { ListContainer } from '@shared/components/ListContainer';
import { useRootStore } from '@shared/hooks';
import { runInAction } from 'mobx';

const RELATED_NUMBER = 6;

export const CityPage: FC = observer(() => {
  const { id: currentCityId } = useParams();
  const rootStore = useRootStore();
  const {
    citiesStore: { fetchRelated, clearRelated, fetchCurrent },
    citiesDataStore: { updateCurrentCity },
  } = rootStore;
  const isLoading = rootStore.citiesStore.isLoading;
  const relatedCities = rootStore.citiesDataStore.relatedCities;
  const currentCity = rootStore.citiesDataStore.currentCity;

  useEffect(() => {
    if (currentCityId) {
      (async () => await fetchCurrent(currentCityId))();
      (async () => await fetchRelated(RELATED_NUMBER, currentCityId))();
    }

    return () => {
      clearRelated();
      runInAction(() => {
        updateCurrentCity(null);
      });
    };
  }, [currentCityId, fetchCurrent, fetchRelated, clearRelated, updateCurrentCity]);

  return (
    <div className={s.page}>
      <BackButton className={s.page__back}>Back</BackButton>
      <CardDetail
        city={
          currentCity
            ? {
                id: currentCity.id,
                image: currentCity.image,
                name: currentCity.name,
                country: currentCity.country,
                population: currentCity.population,
                is_capital: currentCity.is_capital,
                likes: currentCity.likes,
                temp: currentCity.temp,
                localTime: currentCity.localTime,
              }
            : undefined
        }
        action={<Button isLoading={isLoading}>Find ticket</Button>}
        className={s.page__city}
        variant={'single'}
        isLoading={isLoading}
      />
      <section className={s.page__related}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Related Cities
        </Text>
        <ListContainer loadingItems={RELATED_NUMBER} isLoading={isLoading} items={relatedCities} />
      </section>
    </div>
  );
});
