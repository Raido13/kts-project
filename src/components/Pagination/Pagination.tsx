import React, { HTMLAttributes } from 'react';
import cn from 'classnames';
import s from './Pagination.module.scss';
import ArrowPaginationIcon from '@shared/components/Icon/ArrowPaginationIcon';
import Text from '@shared/components/Text';
import { generatePages } from '@shared/utils/utils';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@shared/hooks';
import { DOTS } from '@shared/constants/constants';

interface PaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Дополнительный classname */
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = observer(({ className }) => {
  const rootStore = useRootStore();
  const { setCurrentPage } = rootStore.paginationStore;
  const isLoading = rootStore.citiesStore.isLoading;
  const totalPaginatedCities = rootStore.paginationStore.totalPaginatedCities;
  const viewPerPage = rootStore.paginationStore.viewPerPage;
  const currentPage = rootStore.paginationStore.currentPage;
  const totalPages = Math.ceil(totalPaginatedCities / viewPerPage);

  const pages = generatePages(totalPages, currentPage);

  const isLeftArrowDisabled = totalPages === 0 || currentPage === 1 || isLoading;
  const isRightArrowDisabled = totalPages === 0 || currentPage === totalPages || isLoading;

  return (
    <div className={cn(s.pagination, className)}>
      <button
        disabled={isLeftArrowDisabled}
        className={s.pagination__arrow}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        <ArrowPaginationIcon width={35} height={35} color={isLeftArrowDisabled ? 'secondary' : 'primary'} />
      </button>
      {pages.map((page, idx) => (
        <button
          key={idx}
          className={cn(s.pagination__item, {
            [s.pagination__item_active]: page === currentPage,
            [s.pagination__item_dots]: page === DOTS,
          })}
          onClick={() => setCurrentPage(Number(page))}
          disabled={page === DOTS || isLoading}
        >
          <Text tag={'p'} view={'p-18'} color={page === currentPage ? 'secondary' : 'primary'}>
            {page}
          </Text>
        </button>
      ))}
      <button
        disabled={isRightArrowDisabled}
        className={cn(s.pagination__arrow, s.pagination__arrow_right)}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        <ArrowPaginationIcon width={35} height={35} color={isRightArrowDisabled ? 'secondary' : 'primary'} />
      </button>
    </div>
  );
});
