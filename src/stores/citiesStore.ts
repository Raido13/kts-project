import { fetchCities } from '@shared/services/cities/fetchCities';
import { subscribeToCities } from '@shared/services/cities/subscribeToCity';
import { updateCity } from '@shared/services/cities/updateCity';
import { CityType } from '@shared/types/city';
import { makeAutoObservable, runInAction } from 'mobx';
import { Option } from '@shared/types/options';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Range } from '@shared/types/slider';

class CitiesStore {
  cities: CityType[] = [];
  totalCities: number = 0;

  relatedCities: CityType[] = [];
  paginatedCities: CityType[] = [];

  randomCity: CityType | null = null;
  currentCity: CityType | null = null;
  citiesLikes: Record<string, string[]> = {};

  isLoading: boolean = true;
  requestError: string | null = null;

  dropdownOptions: Option[] = [];
  dropdownValue: Option[] = [];
  filters: string[] = [];
  lastDocs: QueryDocumentSnapshot<DocumentData, DocumentData>[] = [];
  targetCursor: QueryDocumentSnapshot<DocumentData, DocumentData> | null = null;
  searchQuery: string = '';
  currentPage: number = 1;
  viewPerPage: Range<3, 10> = 3;
  private unsubscribeFn: (() => void) | null = null;

  constructor() {
    makeAutoObservable(this);
    this.fetchAllWithRetry();
    this.subscribeToUpdates();
  }

  setError(message: string | null) {
    this.requestError = message;
  }

  async fetchAllWithRetry(retries = 3, delay = 2000) {
    this.isLoading = true;
    const res = (await fetchCities({ mode: 'all' })) as CityType[];

    if (typeof res === 'string') {
      if (retries > 0) {
        setTimeout(() => this.fetchAllWithRetry(retries - 1, delay), delay);
      } else {
        runInAction(() => {
          this.setError(res);
          this.isLoading = false;
        });
      }
      return;
    }

    runInAction(() => {
      this.setError(null);
      this.cities = res;
      this.randomCity = res[Math.floor(Math.random() * res.length)];
      this.citiesLikes = Object.fromEntries(res.map((c) => [c.id, c.likes || []]));
      this.isLoading = false;
    });
  }

  async fetchRelated(citiesNumber: number) {
    this.isLoading = true;
    await fetchCities({ mode: 'related', relatedCities: citiesNumber })
      .then((res) => {
        if (Array.isArray(res)) {
          runInAction(() => {
            this.relatedCities = res as CityType[];
          });
        }
      })
      .finally(() => (this.isLoading = false));
  }

  async fetchCurrent(currentCityId: string) {
    this.isLoading = true;
    await fetchCities({
      mode: 'single',
      currentCityId,
    })
      .then((res) => {
        if (typeof res !== 'string') {
          runInAction(() => {
            this.currentCity = res as CityType;
          });
        }
      })
      .finally(() => (this.isLoading = false));
  }

  subscribeToUpdates() {
    this.unsubscribeFn = subscribeToCities({
      mode: 'all',
      onUpdate: (data) => {
        this.isLoading = true;
        if (typeof data === 'string') {
          this.setError(data);
          return;
        }
        runInAction(() => {
          this.cities = data as CityType[];
        });
        this.isLoading = false;
      },
    });
  }

  async toggleLike(cityId: string, userId: string) {
    const updatedLikes = await updateCity({ mode: 'like', userId });

    if (typeof updatedLikes === 'string') {
      this.setError(updatedLikes);
      return;
    }
    runInAction(() => {
      this.citiesLikes = { ...this.citiesLikes, [cityId]: updatedLikes };
    });
  }

  async loadDropdownOptions() {
    const res = await fetchCities({ mode: 'options' });
    if (Array.isArray(res)) {
      runInAction(() => {
        this.dropdownOptions = res as Option[];
      });
    }
  }

  setDropdownValue(value: Option[]) {
    this.dropdownValue = value;
  }

  getDropdownTitle() {
    return this.dropdownValue.length === 0 ? 'Choose Country' : this.dropdownValue.map(({ value }) => value).join(', ');
  }

  setSearchQuery(value: string) {
    this.searchQuery = value;
  }

  setCurrentPage(page: number) {
    this.currentPage = page;
  }

  setViewPerPageState(viewPerPage: Range<3, 10>) {
    this.viewPerPage = viewPerPage;
  }

  makeEmptyLastDocs() {
    this.lastDocs = [];
  }

  async loadPaginatedCities() {
    this.isLoading = true;

    const res = await fetchCities({
      mode: 'paginate',
      perPage: this.viewPerPage,
      searchQuery: this.searchQuery,
      filters: this.filters,
      lastDoc: this.targetCursor,
    });

    if (typeof res !== 'string' && 'data' in res) {
      runInAction(() => {
        this.paginatedCities = res.data;
        this.totalCities = res.total;

        if (this.currentPage > this.lastDocs.length && res.lastDoc) {
          this.lastDocs.push(res.lastDoc);
        }
      });
    }
    this.isLoading = false;
  }

  dispose() {
    this.unsubscribeFn?.();
  }
}

export const citiesStore = new CitiesStore();
