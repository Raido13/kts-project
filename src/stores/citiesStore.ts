import { fetchCities } from '@shared/services/cities/fetchCities';
import { subscribeToCities } from '@shared/services/cities/subscribeToCities';
import { updateCity } from '@shared/services/cities/updateCity';
import { CityType } from '@shared/types/city';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { Option } from '@shared/types/options';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Range } from '@shared/types/slider';
import { getMostLikedCity } from '@shared/utils/utils';

class CitiesStore {
  isInit: boolean = false;

  cities: CityType[] = [];
  totalCities: number = 0;

  relatedCities: CityType[] = [];
  paginatedCities: CityType[] = [];

  mostLikedCity: CityType | null = null;
  currentCity: CityType | null = null;
  citiesLikes: Record<string, string[]> = {};

  isLoading: boolean = true;
  requestError: string | null = null;

  dropdownOptions: Option[] = [];
  dropdownValue: Option[] = [];
  lastDocs: QueryDocumentSnapshot<DocumentData, DocumentData>[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  viewPerPage: Range<3, 10> = 3;
  private unsubscribeFn: (() => void) | null = null;

  constructor() {
    makeAutoObservable(this, {
      initUrlSync: false,
      initFromUrl: false,
      setStateFromQuery: false,
      fetchAllWithRetry: false,
      subscribeToUpdates: false,
      loadPaginatedCities: false,
      fetchRelated: false,
      fetchCurrent: false,
      toggleLike: false,
      loadDropdownOptions: false,
    });
  }

  initUrlSync = (navigate: (path: string) => void, pathname: string) => {
    return reaction(
      () => ({
        searchQuery: this.searchQuery,
        currentPage: this.currentPage,
        viewPerPage: this.viewPerPage,
        dropdownFilters: this.dropdownFilters,
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
    try {
      const query = new URLSearchParams(search);

      if (!this.isInit) {
        await runInAction(async () => {
          await this.loadDropdownOptions();
          await this.fetchAllWithRetry();
          this.subscribeToUpdates();
          this.isInit = true;
          return;
        });
      }

      await this.setStateFromQuery(query);
      await this.loadPaginatedCities();
    } catch (e) {
      console.error('Error initializing from URL:', e);
    }
  };

  setError = (message: string | null) => {
    this.requestError = message;
  };

  fetchAllWithRetry = async (retries = 3, delay = 2000) => {
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
      this.cities = res;
      this.mostLikedCity = getMostLikedCity(res);
      this.citiesLikes = Object.fromEntries(res.map((c) => [c.id, c.likes || []]));
      this.isLoading = false;
    });
  };

  fetchRelated = async (citiesNumber: number) => {
    runInAction(() => {
      this.isLoading = true;
    });
    await fetchCities({ mode: 'related', relatedCities: citiesNumber })
      .then((res) => {
        if (Array.isArray(res)) {
          runInAction(() => {
            this.relatedCities = res as CityType[];
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
            this.currentCity = res as CityType;
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
          this.cities = data as CityType[];
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
      this.citiesLikes = { ...this.citiesLikes, [cityId]: updatedLikes };
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

  setDropdownValue = (value: Option[]) => {
    runInAction(() => {
      this.setCurrentPage(1);
      this.lastDocs = [];
      this.dropdownValue = value;
    });
  };

  get dropdownTitle() {
    if (!this.dropdownValue) return 'Choose Country';
    return this.dropdownValue.length === 0 ? 'Choose Country' : this.dropdownValue.map(({ value }) => value).join(', ');
  }

  get dropdownFilters() {
    if (!this.dropdownValue) return [];
    return this.dropdownValue.length === 0 ? [] : this.dropdownValue.map(({ value }) => value);
  }

  get targetCursor() {
    return this.currentPage === 1 ? null : (this.lastDocs[this.currentPage - 2] ?? null);
  }

  setSearchQuery = (value: string) => {
    runInAction(() => {
      this.setCurrentPage(1);
      this.lastDocs = [];
      this.searchQuery = value;
    });
  };

  setStateFromQuery = async (query: URLSearchParams) =>
    runInAction(async () => {
      const newQuery = query.get('query') ?? '';
      const newPage = Math.max(1, Number(query.get('page')) || 1);
      const newPerPage = (Number(query.get('viewPerPage')) as Range<3, 10>) || 3;
      const filters = query.getAll('filter');

      const matchedOptions = this.dropdownOptions.filter(({ value }) => filters.includes(value));

      let needsLoad = false;

      if (this.searchQuery !== newQuery) {
        this.setSearchQuery(newQuery);
        needsLoad = true;
      }

      if (this.currentPage !== newPage) {
        this.setCurrentPage(newPage);
        needsLoad = true;
      }

      if (this.viewPerPage !== newPerPage) {
        this.setViewPerPage(newPerPage);
        needsLoad = true;
      }

      if (JSON.stringify(this.dropdownValue) !== JSON.stringify(matchedOptions)) {
        this.setDropdownValue(matchedOptions);
        needsLoad = true;
      }

      return needsLoad;
    });

  setCurrentPage = (page: number) => {
    if (this.currentPage !== page) {
      this.currentPage = page;
    }
  };

  setViewPerPage = (viewPerPage: Range<3, 10>) => {
    this.lastDocs = [];
    this.viewPerPage = viewPerPage;
  };

  loadPaginatedCities = async () => {
    const shouldReset = this.currentPage === 1 || this.searchQuery || this.dropdownFilters.length > 0;
    const targetPage = shouldReset ? 1 : this.currentPage;
    const filters = this.dropdownFilters;
    const cursor = shouldReset ? null : this.targetCursor;

    runInAction(() => {
      this.isLoading = true;
    });

    const res = await fetchCities({
      mode: 'paginate',
      viewPerPage: this.viewPerPage,
      searchQuery: this.searchQuery,
      currentPage: this.currentPage,
      dropdownFilters: filters,
      lastDoc: cursor,
    });

    if (typeof res !== 'string' && 'data' in res) {
      runInAction(() => {
        this.paginatedCities = res.data;
        this.totalCities = res.total;

        if (res.lastDoc) {
          if (targetPage > this.lastDocs.length) {
            this.lastDocs.push(res.lastDoc);
          } else {
            this.lastDocs[targetPage - 1] = res.lastDoc;
          }
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
