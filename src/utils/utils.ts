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
