import { cardVariant } from '@shared/types/card';
import { City } from '@shared/types/city';
import { FC, ReactNode } from 'react';
import Card from '@shared/components/Card';
import Button from '@shared/components/Button';

interface CardDetailProps {
  isLoading?: boolean;
  currentCard?: City;
  variant?: cardVariant;
  action?: ReactNode;
  className?: string;
}

export const CardDetail: FC<CardDetailProps> = ({ isLoading, currentCard, variant = 'single', action, ...props }) =>
  !currentCard || isLoading ? (
    <Card
      variant={variant}
      cardId={''}
      image={''}
      title={''}
      subtitle={''}
      contentSlot={''}
      actionSlot={<Button isSkeletonLoading>{''}</Button>}
      isLoading
      {...props}
    />
  ) : (
    <Card
      variant={variant}
      cardId={currentCard.id}
      image={currentCard.image}
      title={currentCard.name}
      captionSlot={variant !== 'single' && `Country: ${currentCard.country}`}
      subtitle={`Population: ${currentCard.population}`}
      contentSlot={currentCard.is_capital && 'Capital'}
      actionSlot={action}
      {...props}
    />
  );
