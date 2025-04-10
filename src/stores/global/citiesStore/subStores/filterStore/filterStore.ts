import { fetchCities } from '@shared/services/cities/fetchCities';
import { Option } from '@shared/types/options';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { PaginationStore } from '@shared/stores/global/citiesStore/subStores/paginationStore/paginationStore';

export class FilterStore {
  private _searchQuery: string = '';
  private _dropdownOptions: Option[] = [];
  private _dropdownValue: Option[] = [];

  constructor(private _paginationStore: PaginationStore) {
    makeObservable<FilterStore, '_searchQuery' | '_dropdownOptions' | '_dropdownValue'>(this, {
      _searchQuery: observable,
      _dropdownOptions: observable,
      _dropdownValue: observable,
      dropdownTitle: computed,
      dropdownFilters: computed,
      dropdownValue: computed,
      dropdownOptions: computed,
      searchQuery: computed,
      setDropdownValue: action,
      setSearchQuery: action,
      loadDropdownOptions: action,
    });
  }

  get dropdownValue(): Option[] {
    return this._dropdownValue;
  }

  get dropdownOptions(): Option[] {
    return this._dropdownOptions;
  }

  get searchQuery(): string {
    return this._searchQuery;
  }

  get dropdownTitle(): string {
    return this._dropdownValue.length === 0 ? 'Choose Country' : this.dropdownFilters.join(', ');
  }

  get dropdownFilters(): string[] {
    return this._dropdownValue.map(({ value }) => value);
  }

  setDropdownValue = action((value: Option[]) => {
    this._dropdownValue = value;
    this._paginationStore.resetPagination();
  });

  setSearchQuery = action((value: string) => {
    this._searchQuery = value;
    this._paginationStore.resetPagination();
  });

  loadDropdownOptions = action(async () => {
    const res = await fetchCities({ mode: 'options' });
    runInAction(() => {
      if (Array.isArray(res)) {
        this._dropdownOptions = res as Option[];
      }
    });
  });
}
