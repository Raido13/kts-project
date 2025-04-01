import Card from '@shared/components/Card';
import Button from '@shared/components/Button';
import { City } from '@shared/types/city';
import { FC, ReactNode } from 'react';
import { cardVariant } from '@shared/types/card';
import { CITIES } from '@shared/constants/links';
import { Link } from 'react-router-dom';
import s from './ListCard.module.scss';
import cn from 'classnames';

interface ListCardProps {
  isLoading?: boolean;
  currentCard?: City;
  variant?: cardVariant;
  action?: ReactNode;
  className?: string;
}

export const ListCard: FC<ListCardProps> = ({ isLoading, currentCard, variant = 'preview', action, className }) => (
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
