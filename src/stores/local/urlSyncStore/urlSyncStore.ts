import { action, makeObservable, reaction } from 'mobx';
import { FilterStore } from '@shared/stores/local/filterStore/filterStore';
import { PaginationStore } from '@shared/stores/local/paginationStore/paginationStore';
import { Range } from '@shared/types/slider';

export class URLSyncStore {
  constructor(
    private _filterStore: FilterStore,
    private _paginationStore: PaginationStore
  ) {
    makeObservable<URLSyncStore, '_setStateFromQuery'>(this, {
      initFromUrl: action,
      _setStateFromQuery: action,
    });
  }

  initUrlSync = (navigate: (path: string) => void, pathname: string) => {
    return reaction(
      () => ({
        searchQuery: this._filterStore.searchQuery,
        currentPage: this._paginationStore.currentPage,
        viewPerPage: this._paginationStore.viewPerPage,
        dropdownFilters: this._filterStore.dropdownFilters,
      }),
      ({ searchQuery, currentPage, viewPerPage, dropdownFilters }) => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('searchQuery', searchQuery);
        if (currentPage > 1) params.set('currentPage', String(currentPage));
        if (viewPerPage !== 3) params.set('viewPerPage', String(viewPerPage));
        dropdownFilters.forEach((f) => params.append('filter', f));

        navigate(`${pathname}?${params.toString()}`);
      }
    );
  };

  initFromUrl = action(async (search: string) => {
    const query = new URLSearchParams(search);
    await this._setStateFromQuery(query);
  });

  private _setStateFromQuery = action(async (query: URLSearchParams) => {
    const newQuery = query.get('searchQuery') ?? '';
    const newPage = Math.max(1, Number(query.get('currentPage')) || 1);
    const newPerPage = (Number(query.get('viewPerPage')) as Range<3, 10>) || 3;
    const filters = query.getAll('filter');

    const matchedOptions = this._filterStore.dropdownOptions.filter(({ value }) => filters.includes(value));

    let needsLoad = false;

    if (this._filterStore.searchQuery !== newQuery) {
      this._filterStore.setSearchQuery(newQuery);
      needsLoad = true;
    }

    if (this._paginationStore.currentPage !== newPage) {
      this._paginationStore.setCurrentPage(newPage);
      needsLoad = true;
    }

    if (this._paginationStore.viewPerPage !== newPerPage) {
      this._paginationStore.setViewPerPage(newPerPage, true);
      needsLoad = true;
    }

    if (JSON.stringify(this._filterStore.dropdownValue) !== JSON.stringify(matchedOptions)) {
      this._filterStore.setDropdownValue(matchedOptions, true);
      needsLoad = true;
    }

    return needsLoad;
  });
}
