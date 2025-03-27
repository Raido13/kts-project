import { CustomLink } from '@shared/ui/CustomLink';
import ArrowPaginationIcon from '@shared/ui/Icon/ArrowPaginationIcon';
import { FC } from 'react';
import s from './CityPage.module.scss';
import Card from '@shared/ui/Card';
import Text from '@shared/ui/Text';
import { imageMock } from '@shared/lib/mock/cities';
import Button from '@shared/ui/Button';
import { getShuffledItemsFromArray } from '@shared/lib/utils/utils';
import { Link, useParams } from 'react-router-dom';
import { CITIES } from '@shared/lib/constants/links';
import { useCitiesContext } from '@shared/lib/hooks/useCitiesContext';

export const CityPage: FC = () => {
  const { cities, isLoading } = useCitiesContext();
  const { id: cardId } = useParams();

  if (!cardId) return null;

  const relatedCities = getShuffledItemsFromArray(cities, 3, cardId);
  const mockCard = cities.find(({ id }) => id === cardId);

  return (
    <div className={s.city}>
      <div className={s.city__back}>
        <CustomLink icon={<ArrowPaginationIcon width={35} height={35} color={'primary'} />} label={'Back'} path={'/'} />
      </div>
      {!isLoading && (
        <Card
          className={s.city__card}
          variant={'single'}
          image={mockCard?.image ?? imageMock}
          title={mockCard?.name}
          subtitle={`Population: ${mockCard?.population}`}
          contentSlot={mockCard?.is_capital && 'Capital'}
          actionSlot={<Button>More info</Button>}
        />
      )}
      <section className={s.city__related}>
        <Text tag={'p'} view={'title'} color={'primary'}>
          Related Cities
        </Text>
        <ul className={s.city__gallery}>
          {!isLoading &&
            relatedCities.map(({ id, country, name, is_capital, population, image }) => (
              <li key={id} className={s['city__gallery-item']}>
                <Link to={`${CITIES}/:${id}`} className={s.city__link}>
                  <Card
                    image={image}
                    title={name}
                    subtitle={`Population: ${population}`}
                    captionSlot={`Country: ${country}`}
                    contentSlot={is_capital && 'Capital'}
                    actionSlot={<Button>Find ticket</Button>}
                  />
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
};
