import { FC, useMemo } from 'react';
import s from './CityPage.module.scss';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import { getShuffledItemsFromArray } from '@shared/utils/utils';
import { useParams } from 'react-router-dom';
import { useCitiesContext } from '@shared/hooks';
import { BackButton } from '@shared/components/BackButton';
import { ListCard } from '@shared/components/ListCard';
import { CardDetail } from '@shared/components/CardDetail';

export const CityPage: FC = () => {
  const { cities, isLoading } = useCitiesContext();
  const { id: cardId } = useParams();

  const relatedCities = useMemo(() => getShuffledItemsFromArray(cities, 3, cardId as string), [cities, cardId]);
  const currentCard = useMemo(() => cities.find(({ id }) => id === cardId), [cities, cardId]);

  return (
    <div className={s.city}>
      <BackButton className={s.city__back}>Back</BackButton>
      {
        <CardDetail
          isLoading={isLoading}
          currentCard={currentCard}
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
            ? Array.from({ length: 6 }).map((_, idx) => <ListCard isLoading={isLoading} key={idx} />)
            : relatedCities.map(({ id, ...card }) => (
                <ListCard currentCard={{ ...card, id }} action={<Button>Find ticket</Button>} key={id} />
              ))}
        </ul>
      </section>
    </div>
  );
};
