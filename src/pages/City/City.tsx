import { CustomLink } from '@shared/ui/CustomLink';
import ArrowPaginationIcon from '@shared/ui/Icon/ArrowPaginationIcon';
import { FC } from 'react';
import s from './City.module.scss';

export const City: FC = () => (
  <div className={s.city}>
    <CustomLink
      icon={<ArrowPaginationIcon width={35} height={35} color={'primary'} />}
      label={'Back'}
      path={'/'}
      className={s.city__back}
    />
  </div>
);
