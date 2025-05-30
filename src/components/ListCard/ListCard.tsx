import Card from '@shared/components/Card';
import { CityType } from '@shared/types/city';
import { FC, ReactNode } from 'react';
import { CityVariant } from '@shared/types/city';
import { CITIES } from '@shared/constants/links';
import { Link } from 'react-router-dom';
import s from './ListCard.module.scss';
import cn from 'classnames';

interface ListCardProps {
  city?: CityType;
  variant?: CityVariant;
  action?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const ListCard: FC<ListCardProps> = ({ city, action, className, isLoading = false, ...props }) => {
  const isSkeleton = isLoading || !city;
  return (
    <li className={cn(s.city, className)}>
      <Link to={`${CITIES}/${city?.id ?? ''}`} className={s.city__link}>
        <Card
          cityId={city?.id ?? ''}
          image={city?.image}
          title={city?.name}
          captionSlot={city?.country && `Country: ${city.country}`}
          subtitle={city?.population && `Population: ${city.population}`}
          contentSlot={city?.is_capital && 'Capital'}
          actionSlot={action}
          isLoading={isSkeleton}
          {...props}
        />
      </Link>
    </li>
  );
};
