import { fetchCities } from '@shared/services/cities/fetchCities';
import { subscribeToCities } from '@shared/services/cities/subscribeToCity';
import { updateCity } from '@shared/services/cities/updateCity';
import { CityType } from '@shared/types/city';
import { makeAutoObservable, runInAction } from 'mobx';
import { Option } from '@shared/types/options';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

class CitiesStore {
  cities: CityType[] = [];
  totalCities: number = 0;

  relatedCities: CityType[] = [];
  paginatedCities: CityType[] = [];

  randomCity: CityType | null = null;
  singleCity: CityType | null = null;
  citiesLikes: Record<string, string[]> = {};

  isLoading: boolean = true;
  requestError: string | null = null;

  dropdownOptions: Option[] = [];
  lastDocs: QueryDocumentSnapshot<DocumentData, DocumentData>[] = [];
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

  async fetchSingle(currentCityId: string) {
    this.isLoading = true;
    await fetchCities({
      mode: 'single',
      currentCityId,
    })
      .then((res) => {
        if (typeof res !== 'string') {
          runInAction(() => {
            this.singleCity = res as CityType;
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

  async loadPaginatedCities({
    perPage,
    searchQuery,
    filters,
    lastDoc,
    currentPage,
  }: {
    perPage: number;
    searchQuery: string;
    filters: string[];
    lastDoc: QueryDocumentSnapshot<DocumentData, DocumentData> | null;
    currentPage: number;
  }) {
    this.isLoading = true;

    const res = await fetchCities({
      mode: 'paginate',
      perPage,
      searchQuery,
      filters,
      lastDoc,
    });

    if (typeof res !== 'string' && 'data' in res) {
      runInAction(() => {
        this.paginatedCities = res.data;
        this.totalCities = res.total;

        if (currentPage > this.lastDocs.length && res.lastDoc) {
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
