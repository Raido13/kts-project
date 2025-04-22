import { FC } from 'react';
import Text from '@shared/components/Text';
import s from './PageHeader.module.scss';

export const PageHeader: FC = () => (
  <section className={s.description}>
    <Text tag={'h2'} view={'title'} color={'primary'}>
      Citypedia
    </Text>
    <Text tag={'p'} view={'p-20'} color={'secondary'}>
      Explore major cities around the world and discover key information about each one. Find out their population,
      capital status, and the country they belong to — all in one place.
    </Text>
  </section>
);
