import { FC, useEffect, useRef } from 'react';
import Text from '@shared/components/Text';
import s from './HomePage.module.scss';
import { useNavigate } from 'react-router-dom';
import { CITIES } from '@shared/constants/links';
import Button from '@shared/components/Button';
import { useRootStore } from '@shared/hooks';
import { observer } from 'mobx-react-lite';
import { ListContainer } from '@shared/components/ListContainer';
import { FeatureCard } from '@shared/components/FeatureCard';

const RELATED_NUMBER = 3;

export const HomePage: FC = observer(() => {
  const navigation = useNavigate();
  const hasFetched = useRef(false);
  const rootStore = useRootStore();
  const { fetchRelated, clearRelated } = rootStore.citiesStore;
  const isLoading = rootStore.citiesStore.isLoading;
  const relatedCities = rootStore.citiesDataStore.relatedCities;
  const mostLikedCity = rootStore.citiesDataStore.mostLikedCity;

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    (async () => await fetchRelated(RELATED_NUMBER))();

    return () => clearRelated();
  }, [hasFetched, fetchRelated, clearRelated]);

  const handleSimilarButtons = () => {
    navigation({ pathname: CITIES });
  };

  const handleSuggestButton = () => {
    navigation({ pathname: `${CITIES}/${mostLikedCity?.id}` });
  };

  const features: string[] = [
    `Find places you've never seen before`,
    `Unique facts about each city`,
    `Find available tickets in one click`,
    `See which city people like most`,
  ];

  return (
    <div className={s.page}>
      <section className={s.page__description}>
        <Text tag={'h1'} view={'title'} color={'primary'}>
          Explore the World with Citypedia
        </Text>
        <div>
          <Text tag={'p'} view={'p-20'} color={'secondary'}>
            Find your next destination and pack your suitcases.
          </Text>
          <Text tag={'p'} view={'p-20'} color={'secondary'}>
            Here is where the journey begins.
          </Text>
        </div>
        <div className={s['page__button-container']}>
          <Button onClick={handleSimilarButtons}>Choose city</Button>
        </div>
      </section>
      <div className={s.page__features}>
        <Text tag={'h2'} view={'title'} color={'primary'}>
          How can Citypedia help you?
        </Text>
        <div className={s['page__features-container']}>
          {features.map((f, idx) => (
            <FeatureCard text={f} key={idx} />
          ))}
        </div>
        <div className={s['page__button-container']}>
          <Button onClick={handleSimilarButtons}>Explore</Button>
        </div>
      </div>
      <section className={s.page__related}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Let your journey begin!
        </Text>
        <ListContainer loadingItems={RELATED_NUMBER} isLoading={isLoading} isSecond items={relatedCities} />
        <div className={s['page__button-container']}>
          <Button onClick={handleSimilarButtons}>More cities</Button>
        </div>
      </section>
      <div className={s.page__suggest}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Not sure where to go?
        </Text>
        <Text tag={'p'} view={'p-20'} color={'primary'}>
          Let Citypedia choose for you!
        </Text>
        <div className={s['page__button-container']}>
          <Button onClick={handleSuggestButton}>Choose for me</Button>
        </div>
      </div>
    </div>
  );
});
