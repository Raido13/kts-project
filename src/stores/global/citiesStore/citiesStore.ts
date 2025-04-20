import { fetchCities } from '@shared/services/cities/fetchCities';
import { subscribeToCities } from '@shared/services/cities/subscribeToCities';
import { updateCity } from '@shared/services/cities/updateCity';
import { CityComment, CityType } from '@shared/types/city';
import { action, computed, makeAutoObservable, observable, runInAction } from 'mobx';
import { PaginationStore } from '@shared/stores/local/paginationStore';
import { FilterStore } from '@shared/stores/local/filterStore';
import { CitiesDataStore } from '@shared/stores/local/citiesDataStore';
import { URLSyncStore } from '@shared/stores/local/urlSyncStore';
import { MIN_LOADING_TIME } from '@shared/constants/constants';
import { fetchCityInfo } from '@shared/services/cities/fetchCityInfo';

export class CitiesStore {
  private _isInit: boolean = false;
  private _isInitFromUrl: boolean = false;
  private _isLoading: boolean = true;
  private _isLikeLoading: boolean = false;
  private _minLoading: boolean = true;
  private _requestError: string | null = null;
  private _unsubscribeFn: (() => void) | null = null;

  constructor(
    private _urlSyncStore: URLSyncStore,
    private _citiesDataStore: CitiesDataStore,
    private _paginationStore: PaginationStore,
    private _filterStore: FilterStore
  ) {
    makeAutoObservable<
      CitiesStore,
      | '_isInit'
      | '_isInitFromUrl'
      | '_isLoading'
      | '_isLikeLoading'
      | '_minLoading'
      | '_requestError'
      | '_unsubscribeFn'
      | '_startLoading'
      | '_startMinLoading'
      | '_fetchAllWithRetry'
      | '_loadPaginatedCities'
      | '_subscribeToUpdates'
    >(this, {
      _isInit: observable,
      _isInitFromUrl: observable,
      _isLoading: observable,
      _isLikeLoading: observable,
      _minLoading: observable,
      _requestError: observable,
      _unsubscribeFn: observable,
      isInit: computed,
      isInitFromUrl: computed,
      requestError: computed,
      init: action,
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

  get isLikeLoading(): boolean {
    return this._isLikeLoading;
  }

  get isInit(): boolean {
    return this._isInit;
  }

  get isInitFromUrl(): boolean {
    return this._isInitFromUrl;
  }

  init = action(async () => {
    if (!this._isInit) {
      await this._fetchAllWithRetry();
      this._subscribeToUpdates();

      runInAction(() => (this._isInit = true));
    }
  });

  initUrlSync = action((navigate: (path: string) => void, pathname: string) => {
    this._urlSyncStore.initUrlSync(navigate, pathname);
  });

  initFromUrl = action(async (search: string) => {
    try {
      if (!this._isInitFromUrl) {
        await this._filterStore.loadDropdownOptions();

        runInAction(() => (this._isInitFromUrl = true));
      }

      runInAction(async () => {
        await this._urlSyncStore.initFromUrl(search);
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
      this._citiesDataStore.updateCities(res);
      this._isLoading = false;
    });
  });

  fetchRelated = action(async (citiesNumber: number, currentCityId?: string) => {
    this._startLoading();
    await fetchCities({ mode: 'related', relatedCities: citiesNumber, currentCityId })
      .then((res) => {
        runInAction(() => {
          if (Array.isArray(res)) {
            this._citiesDataStore.updateRelatedCities(res as CityType[]);
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
    this._citiesDataStore.updateRelatedCities([]);
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
        this._citiesDataStore.updateCurrentCity({ ...currentCity, ...cityInfo });
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
          this._citiesDataStore.updateCities(data as CityType[]);
          this._isLoading = false;
        });
      },
    });
  });

  toggleLike = action(async (cityId: string, userId: string) => {
    this._isLikeLoading = true;
    const updatedLikes = await updateCity({ mode: 'like', cityId, userId });

    runInAction(() => {
      if (typeof updatedLikes === 'string') {
        this.setError(updatedLikes);
        this._isLikeLoading = false;
        return;
      }
      this._citiesDataStore.updateCityLikes(cityId, updatedLikes as string[]);
      this._isLikeLoading = false;
    });
  });

  addComment = action(async (cityId: string, userId: string, message: string) => {
    const updatedComments = await updateCity({ mode: 'comment', cityId, userId, message });

    runInAction(() => {
      if (typeof updatedComments === 'string') {
        return updatedComments;
      }
      this._citiesDataStore.updateCityComments(cityId, updatedComments as CityComment[]);
    });
  });

  private _loadPaginatedCities = action(async () => {
    this._startLoading();

    const shouldReset =
      this._paginationStore.currentPage === 1 ||
      this._filterStore.searchQuery ||
      this._filterStore.dropdownFilters.length > 0;
    const filters = this._filterStore.dropdownFilters;
    const cursor = shouldReset ? null : this._paginationStore.targetCursor;

    const res = await fetchCities({
      mode: 'paginate',
      viewPerPage: this._paginationStore.viewPerPage,
      searchQuery: this._filterStore.searchQuery,
      currentPage: this._paginationStore.currentPage,
      dropdownFilters: filters,
      lastDoc: cursor,
    });

    runInAction(() => {
      if (typeof res !== 'string' && 'data' in res) {
        this._citiesDataStore.updatePaginatedCities(res.data);
        this._paginationStore.setTotalPaginationCities(res.total);

        if (res.lastDoc) {
          this._paginationStore.setLastDoc(res.lastDoc);
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
