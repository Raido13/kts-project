import Card from '@shared/components/Card';
import Button from '@shared/components/Button';
import { City } from '@shared/types/city';
import { FC, ReactNode, useEffect, useState } from 'react';
import { cardVariant } from '@shared/types/card';
import { CITIES } from '@shared/constants/links';
import { Link } from 'react-router-dom';
import s from './ListCard.module.scss';
import cn from 'classnames';
import { MIN_LOADING_TIME } from '@shared/constants/constants';

interface ListCardProps {
  isLoading?: boolean;
  currentCard?: City;
  variant?: cardVariant;
  action?: ReactNode;
  className?: string;
}

export const ListCard: FC<ListCardProps> = ({
  isLoading: externalLoading,
  currentCard,
  variant = 'preview',
  action,
  className,
}) => {
  const [milLoading, setMinLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMinLoading(false), MIN_LOADING_TIME);
    return () => clearTimeout(timer);
  });

  const isLoading = externalLoading || milLoading;

  return (
    <li className={cn(s.card, className)}>
      {!currentCard || isLoading ? (
        <Card
          variant={variant}
          cardId={''}
          image={''}
          title={''}
          subtitle={''}
          contentSlot={''}
          actionSlot={<Button isSkeletonLoading>{''}</Button>}
          isLoading
        />
      ) : (
        <Link to={`${CITIES}/${currentCard.id}`} className={s.card__link}>
          <Card
            variant={variant}
            cardId={currentCard.id}
            image={currentCard.image}
            title={currentCard.name}
            captionSlot={variant !== 'single' && `Country: ${currentCard.country}`}
            subtitle={`Population: ${currentCard.population}`}
            contentSlot={currentCard.is_capital && 'Capital'}
            actionSlot={action}
          />
        </Link>
      )}
    </li>
  );
};
