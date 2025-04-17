import { CityType } from '@shared/types/city';
import React, { MouseEvent } from 'react';
import { DOTS } from '@shared/constants/constants';

export const getTextFromReactNode = (node: React.ReactNode): string => {
  if (typeof node === 'string') {
    return node;
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getTextFromReactNode(node.props.children);
  }

  return '';
};

export const removeExtraEventActions = (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault?.();
  e.stopPropagation?.();
};

export const createRange = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

export const capitalizeFirst = (str: string) =>
  str.length === 0 ? '' : str[0].toUpperCase() + str.slice(1).toLowerCase();

export const getMostLikedCity = (cities: CityType[]) =>
  cities.reduce((max, city) => ((city.likes?.length || 0) > (max.likes?.length || 0) ? city : max), cities[0]);

export const getLocalTime = (timezoneOffset: number) => {
  const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
  const localDate = new Date(utc + timezoneOffset * 1000);
  return localDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

export const generatePages = (totalPages: number, currentPage: number) => {
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
