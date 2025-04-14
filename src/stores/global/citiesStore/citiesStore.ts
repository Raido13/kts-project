import { fetchCities } from '@shared/services/cities/fetchCities';
import { subscribeToCities } from '@shared/services/cities/subscribeToCities';
import { updateCity } from '@shared/services/cities/updateCity';
import { CityComment, CityType } from '@shared/types/city';
import { action, computed, makeAutoObservable, observable, runInAction } from 'mobx';
import { PaginationStore } from '@shared/stores/global/citiesStore/subStores/paginationStore';
import { FilterStore } from '@shared/stores/global/citiesStore/subStores/filterStore';
import { CitiesDataStore } from '@shared/stores/global/citiesStore/subStores/citiesDataStore';
import { URLSyncStore } from '@shared/stores/global/citiesStore/subStores/urlSyncStore';
import { MIN_LOADING_TIME } from '@shared/constants/constants';
import { fetchCityInfo } from '@shared/services/cities/fetchCityInfo';

export class CitiesStore {
  isInit: boolean = false;
  private _isLoading: boolean = true;
  private _minLoading: boolean = true;
  private _requestError: string | null = null;
  private _unsubscribeFn: (() => void) | null = null;

  paginationStore: PaginationStore;
  filterStore: FilterStore;
  citiesDataStore: CitiesDataStore;
  urlSyncStore: URLSyncStore;

  constructor() {
    this.paginationStore = new PaginationStore();
    this.filterStore = new FilterStore(this.paginationStore);
    this.citiesDataStore = new CitiesDataStore();
    this.urlSyncStore = new URLSyncStore(this.filterStore, this.paginationStore);

    makeAutoObservable<
      CitiesStore,
      | '_isLoading'
      | '_minLoading'
      | '_requestError'
      | '_unsubscribeFn'
      | '_startLoading'
      | '_startMinLoading'
      | '_fetchAllWithRetry'
      | '_loadPaginatedCities'
      | '_subscribeToUpdates'
    >(this, {
      isInit: observable,
      _isLoading: observable,
      _minLoading: observable,
      _requestError: observable,
      _unsubscribeFn: observable,
      requestError: computed,
      initUrlSync: action,
      initFromUrl: action,
      setError: action,
      _startLoading: action,
      _startMinLoading: action,
      _fetchAllWithRetry: action,
      _subscribeToUpdates: action,
      _loadPaginatedCities: action,
      fetchRelated: action,
      fetchCurrent: action,
      toggleLike: action,
    });
  }

  get requestError(): string | null {
    return this._requestError;
  }

  get isLoading(): boolean {
    return this._isLoading || this._minLoading;
  }

  initUrlSync = action((navigate: (path: string) => void, pathname: string) =>
    this.urlSyncStore.initUrlSync(navigate, pathname)
  );

  initFromUrl = action(async (search: string) => {
    try {
      if (!this.isInit) {
        await this.filterStore.loadDropdownOptions();
        await this._fetchAllWithRetry();
        this._subscribeToUpdates();

        runInAction(() => {
          this.isInit = true;
        });
      }

      runInAction(async () => {
        await this.urlSyncStore.initFromUrl(search);
      });
      await this._loadPaginatedCities();
    } catch (e) {
      console.error('Error initializing from URL:', e);
    }
  });

  setError = action((message: string | null) => {
    this._requestError = message;
  });

  private _fetchAllWithRetry = action(async (retries = 3, delay = 2000) => {
    this._startLoading();
    const res = (await fetchCities({ mode: 'all' })) as CityType[];

    if (typeof res === 'string') {
      if (retries > 0) {
        setTimeout(() => this._fetchAllWithRetry(retries - 1, delay), delay);
      } else {
        runInAction(() => {
          this.setError(res);
          this._isLoading = false;
        });
      }
      return;
    }

    runInAction(() => {
      this.setError(null);
      this.citiesDataStore.updateCities(res);
      this._isLoading = false;
    });
  });

  fetchRelated = action(async (citiesNumber: number, currentCityId?: string) => {
    this._startLoading();
    await fetchCities({ mode: 'related', relatedCities: citiesNumber, currentCityId })
      .then((res) => {
        runInAction(() => {
          if (Array.isArray(res)) {
            this.citiesDataStore.updateRelatedCities(res as CityType[]);
          }
        });
      })
      .finally(() => {
        runInAction(() => {
          this._isLoading = false;
        });
      });
  });

  clearRelated = action(() => {
    this.citiesDataStore.updateRelatedCities([]);
  });

  fetchCurrent = action(async (currentCityId: string) => {
    this._startLoading();
    const currentCity = (await fetchCities({
      mode: 'single',
      currentCityId,
    })) as CityType;

    if (typeof currentCity !== 'string') {
      const cityInfo = await fetchCityInfo(currentCity.name);

      runInAction(async () => {
        this.citiesDataStore.updateCurrentCity({ ...currentCity, ...cityInfo });
      });
    }

    runInAction(() => {
      this._isLoading = false;
    });
  });

  private _subscribeToUpdates = action(() => {
    this._unsubscribeFn = subscribeToCities({
      mode: 'all',
      onUpdate: (data) => {
        this._startLoading();

        if (typeof data === 'string') {
          runInAction(() => {
            this.setError(data);
          });
          return;
        }

        runInAction(() => {
          this.citiesDataStore.updateCities(data as CityType[]);
          this._isLoading = false;
        });
      },
    });
  });

  toggleLike = action(async (cityId: string, userId: string) => {
    const updatedLikes = await updateCity({ mode: 'like', cityId, userId });

    runInAction(() => {
      if (typeof updatedLikes === 'string') {
        this.setError(updatedLikes);
        return;
      }
      this.citiesDataStore.updateCityLikes(cityId, updatedLikes as string[]);
    });
  });

  addComment = action(async (cityId: string, userId: string, message: string) => {
    const updatedComments = await updateCity({ mode: 'comment', cityId, userId, message });

    runInAction(() => {
      if (typeof updatedComments === 'string') {
        return updatedComments;
      }
      this.citiesDataStore.updateCityComments(cityId, updatedComments as CityComment[]);
    });
  });

  private _loadPaginatedCities = action(async () => {
    this._startLoading();

    const shouldReset =
      this.paginationStore.currentPage === 1 ||
      this.filterStore.searchQuery ||
      this.filterStore.dropdownFilters.length > 0;
    const targetPage = shouldReset ? 1 : this.paginationStore.currentPage;
    const filters = this.filterStore.dropdownFilters;
    const cursor = shouldReset ? null : this.paginationStore.targetCursor;

    const res = await fetchCities({
      mode: 'paginate',
      viewPerPage: this.paginationStore.viewPerPage,
      searchQuery: this.filterStore.searchQuery,
      currentPage: this.paginationStore.currentPage,
      dropdownFilters: filters,
      lastDoc: cursor,
    });

    runInAction(() => {
      if (typeof res !== 'string' && 'data' in res) {
        this.citiesDataStore.updatePaginatedCities(res.data);
        this.paginationStore.setTotalPaginationCities(res.total);

        if (res.lastDoc) {
          this.paginationStore.updateLastDoc(res.lastDoc, targetPage);
        }
      }
    });

    runInAction(() => {
      this._isLoading = false;
    });
  });

  private _startLoading = action(() => {
    this._startMinLoading();
    this._isLoading = true;
    this._requestError = null;
  });

  private _startMinLoading = action(() => {
    setTimeout(() => {
      runInAction(() => {
        this._minLoading = false;
      });
    }, MIN_LOADING_TIME);
  });

  dispose() {
    this._unsubscribeFn?.();
  }
}
