import React from 'react';
import { City } from '../types/city';

export const getTextFromReactNode = (node: React.ReactNode): string => {
  if (typeof node === 'string') {
    return node;
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getTextFromReactNode(node.props.children);
  }

  return '';
};

export const getShuffledItemsFromArray = (array: City[], count: number, excludeId?: string): City[] =>
  array
    .filter((item) => item.id !== excludeId)
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
