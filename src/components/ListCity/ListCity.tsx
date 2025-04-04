import City from '@shared/components/City';
import Button from '@shared/components/Button';
import { CityType } from '@shared/types/city';
import { FC, ReactNode } from 'react';
import { CityVariant } from '@shared/types/city';
import { CITIES } from '@shared/constants/links';
import { Link } from 'react-router-dom';
import s from './ListCity.module.scss';
import cn from 'classnames';

interface ListCityProps {
  isLoading?: boolean;
  currentCity?: CityType;
  variant?: CityVariant;
  action?: ReactNode;
  className?: string;
}

export const ListCity: FC<ListCityProps> = ({ isLoading, currentCity, variant = 'preview', action, className }) => (
  <li className={cn(s.city, className)}>
    {!currentCity || isLoading ? (
      <City
        variant={variant}
        cityId={''}
        image={''}
        title={''}
        subtitle={''}
        contentSlot={''}
        actionSlot={<Button isSkeletonLoading>{''}</Button>}
        isLoading
      />
    ) : (
      <Link to={`${CITIES}/${currentCity.id}`} className={s.city__link}>
        <City
          variant={variant}
          cityId={currentCity.id}
          image={currentCity.image}
          title={currentCity.name}
          captionSlot={variant !== 'single' && `Country: ${currentCity.country}`}
          subtitle={`Population: ${currentCity.population}`}
          contentSlot={currentCity.is_capital && 'Capital'}
          actionSlot={action}
        />
      </Link>
    )}
  </li>
);
