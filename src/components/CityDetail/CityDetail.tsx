import { CityType, CityVariant } from '@shared/types/city';
import { FC, ReactNode } from 'react';
import City from '@shared/components/City';
import Button from '@shared/components/Button';
import { observer } from 'mobx-react-lite';

interface CityDetailProps {
  isLoading?: boolean;
  currentCity?: CityType;
  variant?: CityVariant;
  action?: ReactNode;
  className?: string;
}

export const CityDetail: FC<CityDetailProps> = ({ isLoading, currentCity, variant = 'single', ...props }) =>
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
    <CityContent variant={variant} currentCity={currentCity} {...props} />
  );

const CityContent = observer(
  ({ currentCity, action, variant, ...props }: { currentCity: CityType } & CityDetailProps) => (
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
  )
);
