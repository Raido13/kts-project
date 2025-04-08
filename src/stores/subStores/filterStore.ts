import { fetchCities } from '@shared/services/cities/fetchCities';
import { Option } from '@shared/types/options';
import { computed, makeAutoObservable, runInAction } from 'mobx';
import { PaginationStore } from './paginationStore';

export class FilterStore {
  searchQuery: string = '';
  dropdownOptions: Option[] = [];
  dropdownValue: Option[] = [];

  constructor(private paginationStore: PaginationStore) {
    makeAutoObservable(this, {
      loadDropdownOptions: false,
      dropdownTitle: computed,
      dropdownFilters: computed,
    });
  }

  get dropdownTitle() {
    if (!this.dropdownValue) return 'Choose Country';
    return this.dropdownValue.length === 0 ? 'Choose Country' : this.dropdownValue.map(({ value }) => value).join(', ');
  }

  get dropdownFilters() {
    if (!this.dropdownValue) return [];
    return this.dropdownValue.length === 0 ? [] : this.dropdownValue.map(({ value }) => value);
  }

  setDropdownValue = (value: Option[]) => {
    runInAction(() => {
      this.dropdownValue = value;
      this.paginationStore.resetPagination();
    });
  };

  setSearchQuery = (value: string) => {
    runInAction(() => {
      this.searchQuery = value;
      this.paginationStore.resetPagination();
    });
  };

  loadDropdownOptions = async () => {
    const res = await fetchCities({ mode: 'options' });
    if (Array.isArray(res)) {
      runInAction(() => {
        this.dropdownOptions = res as Option[];
      });
    }
  };
}
