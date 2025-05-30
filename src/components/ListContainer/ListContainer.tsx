import { FC } from 'react';
import { ListCard } from '@shared/components/ListCard';
import Button from '@shared/components/Button';
import { CityType } from '@shared/types/city';
import cn from 'classnames';
import { useWindowWidth } from '@shared/hooks';
import s from './ListContainer.module.scss';

interface ListContainerProps {
  loadingItems: number;
  items: CityType[];
  isSecond?: boolean;
  isLoading: boolean;
}

export const ListContainer: FC<ListContainerProps> = ({ loadingItems, items, isSecond, isLoading }) => {
  const windowWidth = useWindowWidth();
  return (
    <ul className={cn(s.gallery, windowWidth <= 1440 && s.gallery_resize)}>
      {isLoading
        ? Array(loadingItems)
            .fill(null)
            .map((_, idx) => <ListCard key={idx} action={<Button isLoading={isLoading}>Find ticket</Button>} />)
        : items.map((item) => (
            <ListCard
              city={
                item
                  ? {
                      id: item.id,
                      image: item.image,
                      name: item.name,
                      country: item.country,
                      population: item.population,
                      is_capital: item.is_capital,
                      likes: item.likes,
                    }
                  : undefined
              }
              action={<Button isSecond={isSecond}>{isSecond ? 'More info' : 'Find ticket'}</Button>}
              key={item.id}
            />
          ))}
    </ul>
  );
};
