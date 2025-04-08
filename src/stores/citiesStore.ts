import { fetchCities } from '@shared/services/cities/fetchCities';
import { subscribeToCities } from '@shared/services/cities/subscribeToCities';
import { updateCity } from '@shared/services/cities/updateCity';
import { CityType } from '@shared/types/city';
import { computed, makeAutoObservable, runInAction } from 'mobx';
import { PaginationStore } from './subStores/paginationStore';
import { FilterStore } from './subStores/filterStore';
import { CitiesDataStore } from './subStores/citiesDataStore';
import { URLSyncStore } from './subStores/urlSyncStore';
import { MIN_LOADING_TIME } from '@shared/constants/constants';

class CitiesStore {
  isInit: boolean = false;
  isLoading: boolean = true;
  requestError: string | null = null;
  minLoading: boolean = true;
  private unsubscribeFn: (() => void) | null = null;

  paginationStore: PaginationStore;
  filterStore: FilterStore;
  citiesDataStore: CitiesDataStore;
  urlSyncStore: URLSyncStore;

  constructor() {
    this.paginationStore = new PaginationStore();
    this.filterStore = new FilterStore(this.paginationStore);
    this.citiesDataStore = new CitiesDataStore();
    this.urlSyncStore = new URLSyncStore(this.filterStore, this.paginationStore);

    makeAutoObservable(this, {
      combinedLoading: computed,
      minLoading: true,
      initUrlSync: false,
      initFromUrl: false,
      fetchAllWithRetry: false,
      subscribeToUpdates: false,
      loadPaginatedCities: false,
      fetchRelated: false,
      fetchCurrent: false,
      toggleLike: false,
    });
  }

  initUrlSync = (navigate: (path: string) => void, pathname: string) =>
    this.urlSyncStore.initUrlSync(navigate, pathname);

  initFromUrl = async (search: string) => {
    try {
      if (!this.isInit) {
        await runInAction(async () => {
          await this.filterStore.loadDropdownOptions();
          await this.fetchAllWithRetry();
          this.subscribeToUpdates();
          this.isInit = true;
        });
      }

      await this.urlSyncStore.initFromUrl(search);
      await this.loadPaginatedCities();
    } catch (e) {
      console.error('Error initializing from URL:', e);
    }
  };

  setError = (message: string | null) => {
    this.requestError = message;
  };

  startMinLoading = () => {
    setTimeout(() => {
      runInAction(() => {
        this.minLoading = false;
      });
    }, MIN_LOADING_TIME);
  };

  get combinedLoading() {
    return this.isLoading || this.minLoading;
  }

  fetchAllWithRetry = async (retries = 3, delay = 2000) => {
    this.startMinLoading();
    runInAction(() => {
      this.isLoading = true;
    });
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
      this.citiesDataStore.updateCities(res);
      this.isLoading = false;
    });
  };

  fetchRelated = async (citiesNumber: number) => {
    this.startMinLoading();
    runInAction(() => {
      this.isLoading = true;
    });
    await fetchCities({ mode: 'related', relatedCities: citiesNumber })
      .then((res) => {
        if (Array.isArray(res)) {
          runInAction(() => {
            this.citiesDataStore.updateRelatedCities(res as CityType[]);
          });
        }
      })
      .finally(() =>
        runInAction(() => {
          this.isLoading = false;
        })
      );
  };

  fetchCurrent = async (currentCityId: string) => {
    this.startMinLoading();
    runInAction(() => {
      this.isLoading = true;
    });
    await fetchCities({
      mode: 'single',
      currentCityId,
    })
      .then((res) => {
        if (typeof res !== 'string') {
          runInAction(() => {
            this.citiesDataStore.updateCurrentCity(res as CityType);
          });
        }
      })
      .finally(() =>
        runInAction(() => {
          this.isLoading = false;
        })
      );
  };

  subscribeToUpdates = () => {
    this.unsubscribeFn = subscribeToCities({
      mode: 'all',
      onUpdate: (data) => {
        runInAction(() => {
          this.isLoading = true;
        });
        if (typeof data === 'string') {
          this.setError(data);
          return;
        }
        runInAction(() => {
          this.citiesDataStore.updateCities(data as CityType[]);
          this.isLoading = false;
        });
      },
    });
  };

  toggleLike = async (cityId: string, userId: string) => {
    const updatedLikes = await updateCity({ mode: 'like', userId });

    if (typeof updatedLikes === 'string') {
      this.setError(updatedLikes);
      return;
    }
    runInAction(() => {
      this.citiesDataStore.updateCityLikes(cityId, updatedLikes);
    });
  };

  loadPaginatedCities = async () => {
    const shouldReset =
      this.paginationStore.currentPage === 1 ||
      this.filterStore.searchQuery ||
      this.filterStore.dropdownFilters.length > 0;
    const targetPage = shouldReset ? 1 : this.paginationStore.currentPage;
    const filters = this.filterStore.dropdownFilters;
    const cursor = shouldReset ? null : this.paginationStore.targetCursor;

    this.startMinLoading();
    runInAction(() => {
      this.isLoading = true;
    });

    const res = await fetchCities({
      mode: 'paginate',
      viewPerPage: this.paginationStore.viewPerPage,
      searchQuery: this.filterStore.searchQuery,
      currentPage: this.paginationStore.currentPage,
      dropdownFilters: filters,
      lastDoc: cursor,
    });

    if (typeof res !== 'string' && 'data' in res) {
      runInAction(() => {
        this.citiesDataStore.updatePaginatedCities(res.data);
        this.paginationStore.totalCities = res.total;

        if (res.lastDoc) {
          this.paginationStore.updateLastDoc(res.lastDoc, targetPage);
        }
      });
    }
    runInAction(() => {
      this.isLoading = false;
    });
  };

  dispose() {
    this.unsubscribeFn?.();
  }
}

export const citiesStore = new CitiesStore();
