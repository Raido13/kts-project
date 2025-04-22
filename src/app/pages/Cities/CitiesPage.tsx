import { Pagination } from '@shared/components/Pagination';
import { FC } from 'react';
import s from './CitiesPage.module.scss';
import { PageHeader } from './PageHeader';
import { PageActions } from './PageActions';
import { PageList } from './PageList';

export const CitiesPage: FC = () => (
  <div className={s.page}>
    <PageHeader />
    <PageActions />
    <PageList />
    <Pagination className={s.page__pagination} />
  </div>
);
