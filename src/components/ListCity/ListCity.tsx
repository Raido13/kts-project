import City from '@shared/components/City';
import { CityType } from '@shared/types/city';
import { FC, memo, ReactNode } from 'react';
import { CityVariant } from '@shared/types/city';
import { CITIES } from '@shared/constants/links';
import { Link } from 'react-router-dom';
import s from './ListCity.module.scss';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';

interface ListCityProps {
  city?: CityType;
  variant?: CityVariant;
  action?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const ListCity: FC<ListCityProps> = memo(
  observer(({ city, action, className, isLoading = false, ...props }) => {
    console.log(city);
    const isSkeleton = isLoading || !city;
    return (
      <li className={cn(s.city, className)}>
        <Link to={`${CITIES}/${city?.id ?? ''}`} className={s.city__link}>
          <City
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
  })
);
