import { FC } from 'react';
import { ListCard } from '@shared/components/ListCard';
import Button from '@shared/components/Button';
import { CityType } from '@shared/types/city';
import { observer } from 'mobx-react-lite';
import cn from 'classnames';
import { useWindowWidth } from '@shared/hooks';
import s from './ListContainer.module.scss';

interface ListContainerProps {
  loadingItems: number;
  items: CityType[];
  isLoading: boolean;
}

export const ListContainer: FC<ListContainerProps> = observer(({ loadingItems, items, isLoading }) => {
  const windowWidth = useWindowWidth();
  return (
    <ul className={cn(s.gallery, windowWidth <= 1440 && s.gallery_resize)}>
      {isLoading
        ? Array(loadingItems)
            .fill(null)
            .map((_, idx) => <ListCard key={idx} action={<Button skeletonLoading={true}>Find ticket</Button>} />)
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
              action={<Button>Find ticket</Button>}
              key={item.id}
            />
          ))}
    </ul>
  );
});
