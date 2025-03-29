import { FC } from 'react';
import Text from '@shared/ui/Text';
import s from './NotFoundPage.module.scss';

export const NotFoundPage: FC = () => (
  <div className={s.page}>
    <Text view={'title'} tag={'p'} weight={'bold'} className={s.page__title}>
      404
    </Text>
    <Text view={'p-20'} tag={'p'} weight={'bold'} color={'secondary'} className={s.page__description}>
      Page Not Found
    </Text>
  </div>
);
