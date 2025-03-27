import React, { HTMLAttributes } from 'react';
import cn from 'classnames';
import s from './Pagination.module.scss';
import ArrowPaginationIcon from '../Icon/ArrowPaginationIcon';
import Text from '../Text';

interface PaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Всего элементов */
  total: number;
  /** Всего элементов на странице */
  perPage: number;
  /** Текущая страница */
  currentPage: number;
  /** Коллбек при смене страницы */
  onChange: (page: number) => void;
  /** Дополнительный classname */
  className?: string;
}

const createRange = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

export const Pagination: React.FC<PaginationProps> = ({ total, perPage, currentPage, onChange, className }) => {
  const totalPages = Math.ceil(total / perPage);
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
      <button disabled={currentPage === 1} className={s.pagination__arrow} onClick={() => onChange(currentPage - 1)}>
        <ArrowPaginationIcon width={35} height={35} color={currentPage === 1 ? 'secondary' : 'primary'} />
      </button>
      {pages.map((page, idx) => (
        <button
          key={idx}
          className={cn(s.pagination__item, {
            [s.pagination__item_active]: page === currentPage,
            [s.pagination__item_dots]: page === DOTS,
          })}
          onClick={() => onChange(Number(page))}
          disabled={page === DOTS}
        >
          <Text tag={'p'} view={'p-18'} color={page === currentPage ? 'secondary' : 'primary'}>
            {page}
          </Text>
        </button>
      ))}
      <button
        disabled={currentPage === totalPages}
        className={cn(s.pagination__arrow, s.pagination__arrow_right)}
        onClick={() => onChange(currentPage + 1)}
      >
        <ArrowPaginationIcon width={35} height={35} color={currentPage === totalPages ? 'secondary' : 'primary'} />
      </button>
    </div>
  );
};
