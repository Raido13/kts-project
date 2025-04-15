import { CityDetailType, CityVariant } from '@shared/types/city';
import { FC, memo, ReactNode } from 'react';
import Card from '@shared/components/Card';
import { observer } from 'mobx-react-lite';

interface CardDetailProps {
  city?: CityDetailType;
  variant?: CityVariant;
  action?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const CardDetail: FC<CardDetailProps> = memo(
  observer(({ city, action, variant, isLoading = false, ...props }) => {
    const isSkeleton = isLoading || !city;

    return (
      <Card
        cityId={city?.id ?? ''}
        image={city?.image}
        title={city?.name}
        subtitle={city?.population && `Population: ${city?.population}`}
        captionSlot={city?.country && `Country: ${city?.country}`}
        contentSlot={city?.is_capital && 'Capital'}
        temp={(city?.temp as string | undefined) && `Temperature: ${city?.temp} °C`}
        localTime={city?.localTime && `Time now: ${city?.localTime}`}
        actionSlot={action}
        variant={variant}
        isLoading={isSkeleton}
        {...props}
      />
    );
  })
);
