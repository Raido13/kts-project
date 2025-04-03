import { FC, useEffect, useState } from 'react';
import s from './CityPage.module.scss';
import Text from '@shared/components/Text';
import Button from '@shared/components/Button';
import { useParams } from 'react-router-dom';
import { BackButton } from '@shared/components/BackButton';
import { ListCard } from '@shared/components/ListCard';
import { CardDetail } from '@shared/components/CardDetail';
import { fetchCards } from '@shared/services/cities/fetchCards';
import { City } from '@shared/types/city';

export const CityPage: FC = () => {
  const { id: currentCardId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentCard, setCurrentCard] = useState<City | null>(null);
  const [relatedCities, setRelatedCities] = useState<City[]>([]);

  useEffect(() => {
    setIsLoading(true);

    fetchCards({
      mode: 'single',
      currentCardId,
    })
      .then((res) => {
        if (typeof res !== 'string') {
          setCurrentCard(res as City);
        }
      })
      .finally(() => setIsLoading(false));

    fetchCards({
      mode: 'related',
      currentCardId,
      relatedCards: 3,
    })
      .then((res) => {
        if (Array.isArray(res)) {
          setRelatedCities(res as City[]);
        }
      })
      .finally(() => setIsLoading(false));
  }, [currentCardId]);

  return (
    <div className={s.city}>
      <BackButton className={s.city__back}>Back</BackButton>
      {
        <CardDetail
          currentCard={currentCard ?? undefined}
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
            : relatedCities.map(({ id, ...card }) => (
                <ListCard currentCard={{ ...card, id }} action={<Button>Find ticket</Button>} key={id} />
              ))}
        </ul>
      </section>
    </div>
  );
};
