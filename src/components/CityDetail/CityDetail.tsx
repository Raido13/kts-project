import { CityType, CityVariant } from '@shared/types/city';
import { FC, ReactNode } from 'react';
import City from '@shared/components/City';
import { observer } from 'mobx-react-lite';

interface CityDetailProps {
  city?: CityType;
  variant?: CityVariant;
  action?: ReactNode;
  className?: string;
}

export const CityDetail: FC<CityDetailProps> = observer(({ city, action, variant, ...props }) => (
  <City
    cityId={city?.id ?? ''}
    image={city?.image}
    title={city?.name}
    subtitle={city?.population && `Population: ${city.population}`}
    captionSlot={variant !== 'single' && `Country: ${city?.country}`}
    contentSlot={city?.is_capital && 'Capital'}
    actionSlot={action}
    variant={variant}
    {...props}
  />
));
