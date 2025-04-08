import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { FilterStore } from './filterStore';
import { PaginationStore } from './paginationStore';
import { Range } from '@shared/types/slider';

export class URLSyncStore {
  constructor(
    private filterStore: FilterStore,
    private paginationStore: PaginationStore
  ) {
    makeAutoObservable(this, {
      setStateFromQuery: false,
    });
  }

  initUrlSync = (navigate: (path: string) => void, pathname: string) => {
    return reaction(
      () => ({
        searchQuery: this.filterStore.searchQuery,
        currentPage: this.paginationStore.currentPage,
        viewPerPage: this.paginationStore.viewPerPage,
        dropdownFilters: this.filterStore.dropdownFilters,
      }),
      ({ searchQuery, currentPage, viewPerPage, dropdownFilters }) => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('query', searchQuery);
        if (currentPage > 1) params.set('page', String(currentPage));
        if (viewPerPage !== 3) params.set('viewPerPage', String(viewPerPage));
        dropdownFilters.forEach((f) => params.append('filter', f));

        navigate(`${pathname}?${params.toString()}`);
      }
    );
  };

  initFromUrl = async (search: string) => {
    const query = new URLSearchParams(search);
    await this.setStateFromQuery(query);
  };

  setStateFromQuery = async (query: URLSearchParams) =>
    runInAction(async () => {
      const newQuery = query.get('query') ?? '';
      const newPage = Math.max(1, Number(query.get('page')) || 1);
      const newPerPage = (Number(query.get('viewPerPage')) as Range<3, 10>) || 3;
      const filters = query.getAll('filter');

      const matchedOptions = this.filterStore.dropdownOptions.filter(({ value }) => filters.includes(value));

      let needsLoad = false;

      if (this.filterStore.searchQuery !== newQuery) {
        this.filterStore.setSearchQuery(newQuery);
        needsLoad = true;
      }

      if (this.paginationStore.currentPage !== newPage) {
        this.paginationStore.setCurrentPage(newPage);
        needsLoad = true;
      }

      if (this.paginationStore.viewPerPage !== newPerPage) {
        this.paginationStore.setViewPerPage(newPerPage);
        needsLoad = true;
      }

      if (JSON.stringify(this.filterStore.dropdownValue) !== JSON.stringify(matchedOptions)) {
        this.filterStore.setDropdownValue(matchedOptions);
        needsLoad = true;
      }

      return needsLoad;
    });
}
