import { CityType, CityVariant } from '@shared/types/city';
import { FC, memo, ReactNode } from 'react';
import City from '@shared/components/City';
import { observer } from 'mobx-react-lite';

interface CityDetailProps {
  city?: CityType;
  variant?: CityVariant;
  action?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const CityDetail: FC<CityDetailProps> = memo(
  observer(({ city, action, variant, isLoading = false, ...props }) => {
    const isSkeleton = isLoading || !city;

    return (
      <City
        cityId={city?.id ?? ''}
        image={city?.image}
        title={city?.name}
        subtitle={city?.population && `Population: ${city.population}`}
        captionSlot={city?.country && `Country: ${city?.country}`}
        contentSlot={city?.is_capital && 'Capital'}
        actionSlot={action}
        variant={variant}
        isLoading={isSkeleton}
        {...props}
      />
    );
  })
);
