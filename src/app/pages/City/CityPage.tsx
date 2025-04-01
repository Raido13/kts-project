import { FC, useMemo } from 'react';
import s from './CityPage.module.scss';
import Card from '@shared/components/Card';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import { getShuffledItemsFromArray } from '@shared/utils/utils';
import { Link, useParams } from 'react-router-dom';
import { CITIES } from '@shared/constants/links';
import { useCitiesContext } from '@shared/hooks';
import { BackButton } from '@shared/components/BackButton';

export const CityPage: FC = () => {
  const { cities, isLoading } = useCitiesContext();
  const { id: cardId } = useParams();

  const relatedCities = useMemo(() => getShuffledItemsFromArray(cities, 3, cardId as string), [cities, cardId]);
  const currentCard = useMemo(() => cities.find(({ id }) => id === cardId), [cities, cardId]);

  return (
    <div className={s.city}>
      <BackButton className={s.city__back}>Back</BackButton>
      {isLoading ? (
        <Card
          className={s.city__card}
          variant={'single'}
          cardId={''}
          image={''}
          title={''}
          subtitle={''}
          contentSlot={''}
          actionSlot={<Button isSkeletonLoading>{''}</Button>}
          isLoading
        />
      ) : (
        <Card
          className={s.city__card}
          variant={'single'}
          cardId={currentCard?.id ?? ''}
          image={currentCard?.image}
          title={currentCard?.name}
          subtitle={`Population: ${currentCard?.population}`}
          contentSlot={currentCard?.is_capital && 'Capital'}
          actionSlot={<Button>Find ticket</Button>}
        />
      )}
      <section className={s.city__related}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Related Cities
        </Text>
        <ul className={s.city__gallery}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <li key={idx} className={s['city__gallery-item']}>
                  <Link to={`${CITIES}/${cardId}`} className={s.city__link}>
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
                  </Link>
                </li>
              ))
            : relatedCities.map(({ id, country, name, is_capital, population, image }) => (
                <li key={id} className={s['city__gallery-item']}>
                  <Link to={`${CITIES}/${id}`} className={s.city__link}>
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
    </div>
  );
};
