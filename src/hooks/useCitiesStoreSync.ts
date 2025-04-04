import { useEffect } from 'react';
import { citiesStore } from '@shared/stores';
import { useNavigate, useLocation } from 'react-router-dom';
import { reaction } from 'mobx';

export const useCitiesStoreSync = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { searchQuery, currentPage, viewPerPage, filters } = citiesStore;

  useEffect(() => {
    const dispose = reaction(
      () => ({
        query: searchQuery,
        page: currentPage,
        perPage: viewPerPage,
        filters: filters,
      }),
      ({ query, page, perPage, filters }) => {
        const params = new URLSearchParams();
        if (query) params.set('query', query);
        if (page > 1) params.set('page', String(page));
        if (perPage !== 3) params.set('query', String(perPage));
        filters.forEach((f) => params.append('filter', f));

        navigate({ pathname, search: params.toString() }, { replace: true });
      }
    );

    return () => dispose();
  }, [searchQuery, currentPage, viewPerPage, filters, navigate, pathname]);
};
