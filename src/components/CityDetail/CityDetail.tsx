import { CityType, CityVariant } from '@shared/types/city';
import { FC, ReactNode } from 'react';
import City from '@shared/components/City';
import Button from '@shared/components/Button';

interface CityDetailProps {
  isLoading?: boolean;
  currentCity?: CityType;
  variant?: CityVariant;
  action?: ReactNode;
  className?: string;
}

export const CityDetail: FC<CityDetailProps> = ({ isLoading, currentCity, variant = 'single', action, ...props }) =>
  !currentCity || isLoading ? (
    <City
      variant={variant}
      cityId={''}
      image={''}
      title={''}
      subtitle={''}
      contentSlot={''}
      actionSlot={<Button isSkeletonLoading>{''}</Button>}
      isLoading
      {...props}
    />
  ) : (
    <City
      variant={variant}
      cityId={currentCity.id}
      image={currentCity.image}
      title={currentCity.name}
      captionSlot={variant !== 'single' && `Country: ${currentCity.country}`}
      subtitle={`Population: ${currentCity.population}`}
      contentSlot={currentCity.is_capital && 'Capital'}
      actionSlot={action}
      {...props}
    />
  );
