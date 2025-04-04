import City from '@shared/components/City';
import Button from '@shared/components/Button';
import { CityType } from '@shared/types/city';
import { FC, ReactNode, useEffect, useState } from 'react';
import { CityVariant } from '@shared/types/city';
import { CITIES } from '@shared/constants/links';
import { Link } from 'react-router-dom';
import s from './ListCity.module.scss';
import cn from 'classnames';
import { MIN_LOADING_TIME } from '@shared/constants/constants';
import { observer } from 'mobx-react-lite';

interface ListCityProps {
  isLoading?: boolean;
  currentCity?: CityType;
  variant?: CityVariant;
  action?: ReactNode;
  className?: string;
}

export const ListCity: FC<ListCityProps> = observer(
  ({ isLoading: externalLoading, currentCity, variant = 'preview', action, className }) => {
    const [milLoading, setMinLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setMinLoading(false), MIN_LOADING_TIME);
      return () => clearTimeout(timer);
    });

    const isLoading = externalLoading || milLoading;

    return (
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
  }
);
