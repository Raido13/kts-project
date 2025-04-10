import { Pagination } from '@shared/components/Pagination';
import { FC } from 'react';
import s from './CitiesPage.module.scss';
import { CitiesPageHeader } from '@shared/components/CitiesPageHeader';
import { CitiesPageActions } from '@shared/components/CitiesPageActions';
import { CitiesPageList } from '@shared/components/CitiesPageList';

export const CitiesPage: FC = () => (
  <div className={s.page}>
    <CitiesPageHeader />
    <CitiesPageActions />
    <CitiesPageList />
    <Pagination className={s.page__pagination} />
  </div>
);
