import { CityType } from '@shared/types/city';
import React, { MouseEvent } from 'react';

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
