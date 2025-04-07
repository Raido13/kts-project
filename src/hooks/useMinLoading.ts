import { MIN_LOADING_TIME } from '@shared/constants/constants';
import { citiesStore } from '@shared/stores';
import { useEffect, useState } from 'react';

export const useMinLoading = () => {
  const [minLoading, setMinLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setMinLoading(false), MIN_LOADING_TIME);
    return () => clearTimeout(timer);
  }, []);

  return { isLoading: citiesStore.isLoading || minLoading };
};
