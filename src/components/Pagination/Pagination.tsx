import React, { HTMLAttributes } from 'react';
import cn from 'classnames';
import s from './Pagination.module.scss';
import ArrowPaginationIcon from '@shared/components/Icon/ArrowPaginationIcon';
import Text from '@shared/components/Text';
import { createRange } from '@shared/utils/utils';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@shared/hooks';

interface PaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Дополнительный classname */
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = observer(({ className }) => {
  const rootStoreContext = useRootStore();
  const { isLoading, paginationStore } = rootStoreContext.citiesStore;
  const { totalPaginatedCities, viewPerPage, currentPage, setCurrentPage } = paginationStore;
  const totalPages = Math.ceil(totalPaginatedCities / viewPerPage);
  const DOTS = '...';

  const generatePages = () => {
    if (totalPages <= 4) {
      return createRange(1, totalPages);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, DOTS, totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, DOTS, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, DOTS, currentPage - 1, currentPage, currentPage + 1, DOTS, totalPages];
  };

  const pages = generatePages();

  return (
    <div className={cn(s.pagination, className)}>
      <button
        disabled={currentPage === 1 || isLoading}
        className={s.pagination__arrow}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        <ArrowPaginationIcon width={35} height={35} color={currentPage === 1 ? 'secondary' : 'primary'} />
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
        disabled={currentPage === totalPages || isLoading}
        className={cn(s.pagination__arrow, s.pagination__arrow_right)}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        <ArrowPaginationIcon width={35} height={35} color={currentPage === totalPages ? 'secondary' : 'primary'} />
      </button>
    </div>
  );
});
